'use strict';

define([
  'angular',
  'json!config/url-service.conf.json'
], function (angular, config) {
  angular.module('cedar.templateEditor.service.frontendUrlService', [])
      .service('FrontendUrlService', FrontendUrlService);

  FrontendUrlService.$inject = [];

  function FrontendUrlService() {

    var openViewBase = null;

    var service = {
      serviceId: "FrontendUrlService"
    };

    service.init = function () {
      openViewBase = config.openViewBase;
    };

    service.getTemplateEdit = function (id) {
      return "/templates/edit/" + id;
    };

    service.getElementEdit = function (id) {
      return "/elements/edit/" + id;
    };

    service.getFieldEdit = function (id) {
      return "/fields/edit/" + id;
    };

    service.getInstanceCreate = function (id, folderId) {
      return '/instances/create/' + id + '?folderId=' + encodeURIComponent(folderId);
    };

    service.getInstanceEdit = function (id) {
      return "/instances/edit/" + id;
    };

    service.getFolderContents = function (folderId) {
      return '/dashboard?folderId=' + encodeURIComponent(folderId);
    };

    service.getMyWorkspace = function () {
      return '/dashboard';
    };

    service.getSearchAll = function (folderId) {
      return '/dashboard?search=*&folderId=' + folderId;
    };

    service.getSharedWithMe = function (folderId) {
      return '/dashboard?sharing=shared-with-me&folderId=' + folderId;
    };

    service.getSpecialFolders = function (folderId) {
      return '/dashboard?viewMode=view-special-folders&folderId=' + folderId;
    };

    service.getSharedWithEverybody = function (folderId) {
      return '/dashboard?sharing=shared-with-everybody&folderId=' + folderId;
    };

    service.getMessaging = function (folderId) {
      return '/messaging?folderId=' + encodeURIComponent(folderId);
    };

    service.openField = function (id) {
      return openViewBase + '/template-fields/' + encodeURIComponent(id);
    };

    service.openElement = function (id) {
      return openViewBase + '/template-elements/' + encodeURIComponent(id);
    };

    service.openTemplate = function (id) {
      return openViewBase + '/templates/' + encodeURIComponent(id);
    };

    service.openInstance = function (id) {
      return openViewBase + '/template-instances/' + encodeURIComponent(id);
    };

    service.openFolder = function (id) {
      return openViewBase + '/folders/' + encodeURIComponent(id);
    };

    return service;
  }

});
