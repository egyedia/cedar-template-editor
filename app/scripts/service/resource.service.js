'use strict';

define([
      'angular'
    ], function (angular) {
      angular.module('cedar.templateEditor.service.resourceService', [])
          .service('resourceService', resourceService);

      resourceService.$inject = [
        '$rootScope',
        'AuthorizedBackendService',
        'HttpBuilderService',
        'UISettingsService',
        'UrlService',
        'CedarUser',
        'CONST'
      ];

      function resourceService($rootScope, authorizedBackendService, httpBuilderService, uiSettingsService, urlService,
                               CedarUser, CONST) {

        var searchTerm = null;
        var service = {
          createFolder             : createFolder,
          deleteFolder             : deleteFolder,
          deleteResource           : deleteResource,
          getFacets                : getFacets,
          getResourceDetail        : getResourceDetail,
          getResourceDetailFromId  : getResourceDetailFromId,
          getResources             : getResources,
          searchResources          : searchResources,
          getSearchResourcesPromise: getSearchResourcesPromise,
          hasMetadata              : hasMetadata,
          sharedWithMeResources    : sharedWithMeResources,
          updateFolder             : updateFolder,
          copyResourceToWorkspace  : copyResourceToWorkspace,
          copyResource             : copyResource,
          moveResource             : moveResource,
          getResourceShare         : getResourceShare,
          setResourceShare         : setResourceShare,
          getUsers                 : getUsers,
          getGroups                : getGroups,
          createGroup              : createGroup,
          updateGroup              : updateGroup,
          deleteGroup              : deleteGroup,
          getGroupMembers          : getGroupMembers,
          updateGroupMembers       : updateGroupMembers,
          canRead                  : canRead,
          canWrite                 : canWrite,
          canChangeOwner           : canChangeOwner,
          canShare                 : canShare,
          canPublish               : canPublish,
          canCreateDraft           : canCreateDraft,
          publishResource          : publishResource,
          createDraftResource      : createDraftResource,
          renameNode               : renameNode,
          validateResource         : validateResource
        };
        return service;

        /**
         * Service methods.
         */

        function createFolder(parentFolderId, name, description, successCallback, errorCallback) {
          var url = urlService.folders();
          var payload = {
            folderId   : parentFolderId,
            name       : name,
            description: description
          };
          authorizedBackendService.doCall(
              httpBuilderService.post(url, payload),
              function (response) {
                successCallback(response.data);
              },
              errorCallback
          );
        }

        function deleteResource(resource, successCallback, errorCallback) {
          var url;
          var id = resource['@id'];
          switch (resource.nodeType) {
            case CONST.resourceType.FIELD:
              url = urlService.getTemplateField(id);
              break;
            case CONST.resourceType.FOLDER:
              url = urlService.getFolder(id);
              break;
            case CONST.resourceType.TEMPLATE:
              url = urlService.getTemplate(id);
              break;
            case CONST.resourceType.ELEMENT:
              url = urlService.getTemplateElement(id);
              break;
            case CONST.resourceType.INSTANCE:
              url = urlService.getTemplateInstance(id);
              break;
          }
          authorizedBackendService.doCall(
              httpBuilderService.delete(url),
              function (response) {
                successCallback(response.data);
              },
              errorCallback
          );
        }

        function deleteFolder(folderId, successCallback, errorCallback) {
          var url = urlService.folders() + '/' + encodeURIComponent(folderId);
          authorizedBackendService.doCall(
              httpBuilderService.delete(url),
              function (response) {
                successCallback(response.data);
              },
              errorCallback
          );
        }

        function getFacets(successCallback, errorCallback) {
          var dummyData = {
            facets: {
              "author": {
                "totalCount": 245,
                "nodes"     : [
                  {
                    "label"          : "Author 1",
                    "key"            : "authorIdFromIndex1",
                    "numberOfMatches": 6,
                    "selected"       : true,
                    "hasChildren"    : false
                  },
                  {
                    "label"          : "Author 2",
                    "key"            : "authorIdFromIndex2",
                    "numberOfMatches": 7,
                    "selected"       : false,
                    "hasChildren"    : false
                  },
                  {
                    "label"          : "Author 3",
                    "key"            : "authorIdFromIndex3",
                    "numberOfMatches": 8,
                    "selected"       : false,
                    "hasChildren"    : false
                  }
                ]
              },
              "status": {
                "totalCount": 3,
                "nodes"     : [
                  {
                    "label"          : "Draft",
                    "key"            : "draft",
                    "numberOfMatches": 20,
                    "selected"       : false,
                    "hasChildren"    : false
                  },
                  {
                    "label"          : "Complete",
                    "key"            : "complete",
                    "numberOfMatches": 255,
                    "selected"       : false,
                    "hasChildren"    : false
                  },
                  {
                    "label"          : "Reviewed",
                    "key"            : "reviewed",
                    "numberOfMatches": 10,
                    "selected"       : false,
                    "hasChildren"    : false
                  }
                ]
              },
              "term"  : {
                "totalCount": 8,
                "nodes"     : [
                  {
                    "label"          : "CTO",
                    "key"            : "CTO",
                    "numberOfMatches": 3,
                    "selected"       : false,
                    "hasChildren"    : false
                  },
                  {
                    "label"          : "ICD",
                    "key"            : "ICD",
                    "numberOfMatches": 10,
                    "selected"       : false,
                    "hasChildren"    : false
                  },
                  {
                    "label"          : "SNOMED-CT",
                    "key"            : "SNOMED-CT",
                    "numberOfMatches": 6,
                    "selected"       : false,
                    "hasChildren"    : true,
                    "nodes"          : [
                      {
                        "label"          : "Influenza",
                        "key"            : "INF",
                        "numberOfMatches": 6,
                        "hasChildren"    : true,
                        "nodes"          : [
                          {
                            "label"          : "Influenza Type A",
                            "key"            : "INFA",
                            "numberOfMatches": 6,
                            "selected"       : false,
                            "hasChildren"    : false
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            }
          };
          var response = {data: dummyData};
          successCallback(response.data);
          return;

          /*var url = UrlService.facets();
           authorizedBackendService.doCall(
           httpBuilderService.get(url),
           function (response) {
           successCallback(response.data);
           },
           errorCallback
           );*/
        }

        function getResourceDetailFromId(id, nodeType, successCallback, errorCallback) {
          var url;

          switch (nodeType) {
            case CONST.resourceType.FOLDER:
              url = urlService.folders() + '/' + encodeURIComponent(id);
              break;
            case CONST.resourceType.FIELD:
              url = urlService.getTemplateField(id) + '/details';
              break;
            case CONST.resourceType.ELEMENT:
              url = urlService.getTemplateElement(id) + '/details';
              break;
            case CONST.resourceType.TEMPLATE:
              url = urlService.getTemplate(id) + '/details';
              break;
            case CONST.resourceType.INSTANCE:
              url = urlService.getTemplateInstance(id) + '/details';
              break;
          }
          authorizedBackendService.doCall(
              httpBuilderService.get(url),
              function (response) {
                successCallback(response.data);
              },
              errorCallback
          );
        }

        function getResourceDetail(resource, successCallback, errorCallback) {
          var url;
          var id = resource['@id'];
          switch (resource.nodeType) {
            case CONST.resourceType.FOLDER:
              url = urlService.folders() + '/' + encodeURIComponent(id);
              break;
            case CONST.resourceType.ELEMENT:
              url = urlService.getTemplateElement(id) + '/details';
              break;
            case CONST.resourceType.FIELD:
              url = urlService.getTemplateField(id) + '/details';
              break;
            case CONST.resourceType.TEMPLATE:
              url = urlService.getTemplate(id) + '/details';
              break;
            case CONST.resourceType.INSTANCE:
              url = urlService.getTemplateInstance(id) + '/details';
              break;
          }
          authorizedBackendService.doCall(
              httpBuilderService.get(url),
              function (response) {
                successCallback(response.data);
              },
              errorCallback
          );
        }

        function validateResource(resource, resourceType, successCallback, errorCallback) {

          var url = urlService.validateResource(resourceType);
          authorizedBackendService.doCall(
              httpBuilderService.post(url, resource),
              function (response) {
                successCallback(response.data);
              },
              errorCallback
          );
        }

        function getResources(options, successCallback, errorCallback) {

          if (options == null) {
            options = {};
          }

          var params = {};
          var baseUrl = urlService.folders();
          if (options.path) {
            baseUrl += '/contents';
            params['path'] = options.path;
          }
          if (options.folderId) {
            baseUrl += '/' + encodeURIComponent(options.folderId) + '/contents';
          }

          addCommonParameters(params, options);

          var url = $rootScope.util.buildUrl(baseUrl, params);

          authorizedBackendService.doCall(
              httpBuilderService.get(url),
              function (response) {
                successCallback(response.data);
              },
              errorCallback
          );
        }

        // return the search results
        function searchResources(searchTerm, options, successCallback, errorCallback) {
          if (options == null) {
            options = {};
          }
          this.searchTerm = searchTerm;
          var params = {};
          var baseUrl = urlService.search();

          if (searchTerm == 'null') {
            searchTerm = '';
          }

          if (searchTerm) {
            params['q'] = searchTerm;
          }

          addCommonParameters(params, options);

          var url = $rootScope.util.buildUrl(baseUrl, params);

          authorizedBackendService.doCall(
              httpBuilderService.get(url),
              function (response) {
                successCallback(response.data);
              },
              errorCallback
          );
        }

        // does a template have at least one instance?
        function hasMetadata(id, options, successCallback, errorCallback) {
          if (options == null) {
            options = {};
          }

          var params = {};
          var baseUrl = urlService.search();

          if (id == 'null') {
            id = '';
          }

          if (id) {
            params['is_based_on'] = id;
          }

          addCommonParameters(params, options);
          delete params['resource_types'];

          var url = $rootScope.util.buildUrl(baseUrl, params);

          authorizedBackendService.doCall(
              httpBuilderService.get(url),
              function (response) {
                successCallback(response.data);
              },
              errorCallback
          );
        }

        // return the promise instead of the result
        function getSearchResourcesPromise(searchTerm, options, successCallback, errorCallback) {
          if (options == null) {
            options = {};
          }
          this.searchTerm = searchTerm;
          var params = {};
          var baseUrl = urlService.search();

          if (searchTerm == 'null') {
            searchTerm = '';
          }

          if (searchTerm) {
            params['q'] = searchTerm;
          }

          addCommonParameters(params, options);

          var url = $rootScope.util.buildUrl(baseUrl, params);

          return authorizedBackendService.getHttpPromise(httpBuilderService.get(url)).then(function (response) {
            return successCallback(response);
          }).catch(function (err) {
            return errorCallback(err);
          });
        };

        function sharedWithMeResources(options, successCallback, errorCallback) {
          if (options == null) {
            options = {};
          }
          var params = {};
          var baseUrl = urlService.sharedWithMe();

          addCommonParameters(params, options);

          var url = $rootScope.util.buildUrl(baseUrl, params);

          authorizedBackendService.doCall(
              httpBuilderService.get(url),
              function (response) {
                successCallback(response.data);
              },
              errorCallback
          );
        }


        // private function
        function addCommonParameters(params, options) {
          var resourceTypes = options.resourceTypes || uiSettingsService.getResourceTypeFilters().map(function (obj) {
            return obj.resourceType
          });
          params['resource_types'] = resourceTypes.join(',');
          if (angular.isArray(options.sort)) {
            params['sort'] = options.sort.join(',');
          } else {
            params['sort'] = options.sort;
          }
          if ('limit' in options) {
            params['limit'] = options.limit;
          }
          if ('offset' in options) {
            params['offset'] = options.offset;
          }
          if ('version' in options) {
            params['version'] = options.version;
          }
          if ('publicationStatus' in options) {
            params['publication_status'] = options.publicationStatus;
          }
        }

        function updateFolder(folder, successCallback, errorCallback) {
          var url = urlService.getFolder(folder['@id']);

          authorizedBackendService.doCall(
              httpBuilderService.put(url, angular.toJson(folder)),
              function (response) {
                successCallback(response.data);
              },
              errorCallback
          );

        }

        function copyResourceToWorkspace(resource, newTitle, successCallback, errorCallback) {
          var postData = {};
          postData['@id'] = resource['@id'];
          postData['folderId'] = CedarUser.getHomeFolderId();
          postData['titleTemplate'] = newTitle;
          var url = urlService.copyResourceToFolder();
          authorizedBackendService.doCall(
              httpBuilderService.post(url, postData),
              function (response) {
                successCallback(response.data);
              },
              errorCallback
          );
        }

        function copyResource(resource, folderId, newTitle, successCallback, errorCallback) {
          var postData = {};
          postData['@id'] = resource['@id'];
          postData['folderId'] = folderId;
          postData['titleTemplate'] = newTitle;
          var url = urlService.copyResourceToFolder();
          authorizedBackendService.doCall(
              httpBuilderService.post(url, postData),
              function (response) {
                successCallback(response.data);
              },
              errorCallback
          );
        }

        function moveResource(resource, folderId, successCallback, errorCallback) {
          var postData = {};
          postData['sourceId'] = resource['@id'];
          postData['nodeType'] = resource['nodeType'];
          postData['folderId'] = folderId;

          var url = urlService.moveNodeToFolder();
          authorizedBackendService.doCall(
              httpBuilderService.post(url, postData),
              successCallback,
              errorCallback
          );
        }

        function publishResource(resource, newVersion, successCallback, errorCallback) {
          var postData = {};
          postData['@id'] = resource['@id'];
          postData['newVersion'] = newVersion;
          var url = urlService.publishResource();
          authorizedBackendService.doCall(
              httpBuilderService.post(url, postData),
              function (response) {
                successCallback(response.data);
              },
              errorCallback
          );
        }

        function createDraftResource(resource, folderId, newVersion, propagateSharing, successCallback, errorCallback) {
          var postData = {};
          postData['@id'] = resource['@id'];
          postData['newVersion'] = newVersion;
          postData['folderId'] = folderId;
          postData['propagateSharing'] = propagateSharing;
          var url = urlService.createDraftResource();
          authorizedBackendService.doCall(
              httpBuilderService.post(url, postData),
              function (response) {
                successCallback(response.data);
              },
              errorCallback
          );
        }


        function getResourceShare(resource, successCallback, errorCallback) {
          var url;
          var id = resource['@id'];
          switch (resource.nodeType) {
            case CONST.resourceType.FOLDER:
              url = urlService.folderPermission(id);
              break;
            case CONST.resourceType.ELEMENT:
              url = urlService.templateElementPermission(id);
              break;
            case CONST.resourceType.TEMPLATE:
              url = urlService.templatePermission(id);
              break;
            case CONST.resourceType.INSTANCE:
              url = urlService.templateInstancePermission(id);
              break;
            case CONST.resourceType.FIELD:
              url = urlService.templateFieldPermission(id);
              break;
          }
          authorizedBackendService.doCall(
              httpBuilderService.get(url),
              function (response) {
                successCallback(response.data);
              },
              errorCallback
          );
        }

        function setResourceShare(resource, permissions, successCallback, errorCallback) {
          var url;
          var id = resource['@id'];
          switch (resource.nodeType) {
            case CONST.resourceType.FOLDER:
              url = urlService.folderPermission(id);
              break;
            case CONST.resourceType.ELEMENT:
              url = urlService.templateElementPermission(id);
              break;
            case CONST.resourceType.TEMPLATE:
              url = urlService.templatePermission(id);
              break;
            case CONST.resourceType.INSTANCE:
              url = urlService.templateInstancePermission(id);
              break;
            case CONST.resourceType.FIELD:
              url = urlService.templateFieldPermission(id);
              break;
          }
          authorizedBackendService.doCall(
              httpBuilderService.put(url, permissions),
              function (response) {
                successCallback(response.data);
              },
              errorCallback
          );
        }

        function getUsers(successCallback, errorCallback) {
          var url = urlService.getUsers();
          authorizedBackendService.doCall(
              httpBuilderService.get(url),
              function (response) {
                successCallback(response.data);
              },
              errorCallback
          );
        }

        function getGroups(successCallback, errorCallback) {
          var url = urlService.getGroups();
          authorizedBackendService.doCall(
              httpBuilderService.get(url),
              function (response) {
                successCallback(response.data);
              },
              errorCallback
          );
        }

        function createGroup(name, description, successCallback, errorCallback) {
          var url = urlService.getGroups();
          var payload = {
            "schema:name"       : name,
            "schema:description": description
          };
          authorizedBackendService.doCall(
              httpBuilderService.post(url, payload),
              function (response) {
                successCallback(response.data);
              },
              errorCallback
          );
        }

        function updateGroup(group, successCallback, errorCallback) {
          var url = urlService.getGroup(group['@id']);

          authorizedBackendService.doCall(
              httpBuilderService.put(url, angular.toJson(group)),
              function (response) {
                successCallback(response.data);
              },
              errorCallback
          );
        }

        function deleteGroup(id, successCallback, errorCallback) {
          var url = urlService.getGroup(id);

          authorizedBackendService.doCall(
              httpBuilderService.delete(url),
              function (response) {
                successCallback(response.data);
              },
              errorCallback
          );
        }

        function getGroupMembers(id, successCallback, errorCallback) {
          var url = urlService.getGroupMembers(id);

          authorizedBackendService.doCall(
              httpBuilderService.get(url),
              function (response) {
                successCallback(response.data);
              },
              errorCallback
          );
        }

        function updateGroupMembers(group, successCallback, errorCallback) {
          var url = urlService.getGroupMembers(group['@id']);

          var payload = {};
          payload.users = group.users;

          authorizedBackendService.doCall(
              httpBuilderService.put(url, angular.toJson(payload)),
              function (response) {
                successCallback(response.data);
              },
              errorCallback
          );
        }

        /* permissions */

        function canRead(resource) {
          if (resource != null) {
            var perms = resource.currentUserPermissions;
            if (perms != null) {
              return perms.indexOf("read") != -1;
            }
          }
          return false;
        }

        function canWrite(resource) {
          if (resource != null) {
            var perms = resource.currentUserPermissions;
            if (perms != null) {
              return perms.indexOf("write") != -1;
            }
          }
          return false;
        }

        function canChangeOwner(resource) {
          if (resource != null) {
            var perms = resource.currentUserPermissions;
            if (perms != null) {
              return perms.indexOf("changeowner") != -1;
            }
          }
          return false;
        }

        function canShare(resource) {
          if (resource != null) {
            var perms = resource.currentUserPermissions;
            if (perms != null) {
              return perms.indexOf("changepermissions") != -1;
            }
          }
          return false;
        }

        function canPublish(resource) {
          if (resource != null) {
            var perms = resource.currentUserPermissions;
            if (perms != null) {
              return perms.indexOf("publish") != -1;
            }
          }
          return false;
        }

        function canCreateDraft(resource) {
          if (resource != null) {
            var perms = resource.currentUserPermissions;
            if (perms != null) {
              return perms.indexOf("createdraft") != -1;
            }
          }
          return false;
        }

        function renameNode(id, name, description) {
          var command = {
            "id"      : id
          };
          if (name != null) {
            command["name"] = name;
          }
          if (description != null) {
            command["description"] = description;
          }
          return httpBuilderService.post(urlService.renameNode(), angular.toJson(command));
        }

      }

    }
)
;
