import _ from 'lodash'
import { config, elementJson, elements } from '../config/schemaMapping'

const isObject = item => {
  return item && typeof item === 'object' && !Array.isArray(item)
}

/**
 * Do a deep merge
 * @param target
 * @param source
 * @returns {*}
 */

export const mergeSchemaMapping = (target, source, propertiesCounter = 0) => {
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (!target[key]) {
        if (source[key].type) {
          target[key] = config[source[key].type]
            ? config[source[key].type].default
            : { ...elements['json'] }
        } else if (source[key].properties) {
          if (propertiesCounter >= 2) {
            target[key] = { ...elements['json'] }
            return
          }
          propertiesCounter += 1

          target[key] = {
            tag: 'fieldset',
            properties: mergeSchemaMapping(
              {},
              source[key].properties,
              propertiesCounter
            )
          }
          propertiesCounter = 0
        }
      }
    })
  }
  return target
}

export const flattenObjectMapping = (mapping, path = '', level = 1) => {
  let flattenObj = {}

  if (path !== '') {
    path += '.'
  }

  Object.keys(mapping).forEach(attribute => {
    if (mapping[attribute].properties) {
      if (level > 1) {
        flattenObj[path + attribute] = 'force-json'
      } else {
        flattenObj = {
          ...flattenObj,
          ...flattenObjectMapping(
            mapping[attribute].properties,
            path + attribute,
            level + 1
          )
        }
      }
    } else {
      flattenObj[path + attribute] = mapping[attribute].type
    }
  })

  return flattenObj
}

/**
 * Returns the schema with only one level: {a: [...], b: {c: [...]}} will returns {'a': [...], 'b.c': [...]}
 * @param schema {Object}
 * @param path {String}
 * @param level {Number}
 * @returns {Object}
 */
export const flattenObjectSchema = (schema, path = '', level = 1) => {
  let flattenObj = {}

  if (path !== '') {
    path += '.'
  }

  Object.keys(schema).forEach(attribute => {
    if (schema[attribute].properties) {
      if (level > 1) {
        flattenObj[path + attribute] = { ...elementJson }
      } else {
        flattenObj = {
          ...flattenObj,
          ...flattenObjectSchema(
            schema[attribute].properties,
            path + attribute,
            level + 1
          )
        }
      }
    } else {
      flattenObj[path + attribute] = schema[attribute]
    }
  })

  return flattenObj
}

export const getSchemaForType = type => {
  if (!config[type] || !config[type].elements) {
    return [{ ...elementJson }]
  }

  return config[type].elements
    .map(element => {
      return { ...element }
    })
    .concat([{ ...elementJson }])
}

export const getDefaultSchemaForType = type => {
  if (!config[type] || !config[type].default) {
    return { ...elementJson }
  }

  return { ...config[type].default }
}

export const getElementDefinition = id => {
  return elements[id]
}

export const castByElementId = (id, value) => {
  let element = elements[id]
  if (!element) {
    return value
  }

  switch (element.cast) {
    case 'integer':
      return parseInt(value) || null
    case 'float':
      return parseFloat(value) || null
    default:
      return value
  }
}

/**
 * Format schema in order to be stored in Kuzzle: add the tag "fieldset" for attribute with sub properties
 * @param schema {Object}
 * @returns {Object} the formatted schema ready to be stored
 */
export const formatSchema = schema => {
  let formattedSchema = {}

  Object.keys(schema).map(attributeName => {
    let fullPath = attributeName

    if (attributeName.indexOf('.') !== -1) {
      let path = attributeName.split('.')
      fullPath = [path[0], 'properties', ...path.slice(1)].join('.')
    }

    _.set(formattedSchema, fullPath, schema[attributeName])
  })

  return formattedSchema
}

/**
 * Returns the merge of mapping, schema and allowForm in order to be stored in Kuzzle
 * @param mapping {Object}
 * @param schema {Object}
 * @param allowForm {Boolean}
 * @returns {{properties: {}, _meta: {schema: *, allowForm: *}}}
 */
export const mergeMetaAttributes = ({ mapping, schema, allowForm }) => {
  return { dynamic: mapping.dynamic, properties: mapping.properties, _meta: { schema, allowForm } }
}

/**
 * Returns a cleaned mapping with only "attribute: attributeType"
 * @param mapping {Object}
 * @returns the cleaned mapping
 */
export const cleanMapping = mapping => {
  let _mapping = {}

  Object.keys(mapping).forEach(attr => {
    if (attr === 'properties') {
      _mapping.properties = cleanMapping(mapping.properties)
    } else if (attr === 'dynamic') {
      _mapping.dynamic = mapping.dynamic
    } else {
      _mapping[attr] = mapping[attr].type
    }
  })

  return _mapping
}

/**
 * Returns true if there is no attribute in json that is not present in document
 * @param document {Object}
 * @param schema {Object}
 */
export const hasSameSchema = (document, schema) => {
  return Object.keys(document).every(attribute => {
    return checkPathSchemaRecursive(document, schema, attribute)
  })
}

export const removeMeta = mapping => {
  const cleanMapping = mapping
  delete cleanMapping._meta

  return cleanMapping
}

const checkPathSchemaRecursive = (document, schema, path) => {
  let pathSchema = path.split('.').join('.properties.')
  if (!_.has(schema, pathSchema)) {
    return false
  }

  if (_.get(schema, pathSchema).properties) {
    return Object.keys(_.get(document, path)).every(attribute => {
      return checkPathSchemaRecursive(document, schema, path + '.' + attribute)
    })
  }

  return true
}
