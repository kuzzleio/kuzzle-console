angular.module('kuzzle.userApi', ['ui-notification', 'kuzzle.kuzzleSdk'])

  .service('userApi', [
    'kuzzleSdk',
    '$http',
    'Notification',
    '$q',
    function (kuzzleSdk, $http, notification, $q) {
      return {
        list: function () {
          var deferred = $q.defer();

          kuzzleSdk.security.searchUsers({from: 0, size: 10000}, function (error, response) {
            if (error) {
              deferred.reject(error);
              return;
            }

            deferred.resolve(response.roles);
          });

          return deferred.promise;
        },
        get: function (id) {
          var deferred = $q.defer();

          kuzzleSdk.security.getUser(id, function (error, role) {
            if (error) {
              deferred.reject(error);
              return;
            }

            deferred.resolve(role);
          });

          return deferred.promise;
        },
        update: function (role, notify, isCreate) {
          var
            deferred = $q.defer(),
            messageSuccess,
            messageError;

          if (isCreate) {
            messageError = 'Error during user creation. Please retry.';
            messageSuccess = 'User created !';
          }
          else {
            messageError = 'Error during user update. Please retry.';
            messageSuccess = 'User updated !';
          }

          //kuzzleSdk
          //  .dataCollectionFactory(collection.name)
          //  .putMapping(collection.schema, function (error) {
              var error = false; // to delete
              if (error) {
                if (notify) {
                  notification.error(messageError);
                }

                deferred.reject({error: true, message: error});
                return deferred.promise; // to delete
              }

              if (notify) {
                notification.success(messageSuccess);
              }

              deferred.resolve({error: false});
            //});

          return deferred.promise;
        },
        deleteById: function (id, notify) {
          var deferred = $q.defer();

          deferred.resolve({error: false});
          notification.success('User deleted!');

          return deferred.promise;
        }
      };
    }]);
