'use strict';

define(['app', 'angular'], function (app) {

  describe('cedar-new-folder-modal.directive_test.js:', function () {

    var $rootScope;
    var $compile;
    var $controller;
    var $httpBackend;
    var UIMessageService;
    var UrlService;
    var resourceService;
    var UISettingsService;
    var QueryParamUtilsService;
    var $timeout;
    var appData = applicationData.getConfig();
    var cedarUser = cedarUserData.getConfig(appData);

    // Load the module that contains the templates that were loaded with html2js
    beforeEach(module('my.templates'));
    // Load other modules
    beforeEach(module(app.name));
    beforeEach(module('cedar.templateEditor.modal.cedarNewFolderModalDirective'));
    beforeEach(module('cedar.templateEditor.service.uIMessageService'));
    beforeEach(module('cedar.templateEditor.service.resourceService'));
    beforeEach(module('cedar.templateEditor.service.uISettingsService'));
    beforeEach(module('cedar.templateEditor.service.queryParamUtilsService'));
    // we need to register our alternative version of CedarUser, before we call inject.
    beforeEach(angular.mock.module(function ($provide) {
      $provide.service('CedarUser', function mockCedarUser() {
        return cedarUser;
      });
    }));
    beforeEach(module('cedar.templateEditor.modal.cedarCopyModalDirective', function ($provide) {
      $provide.factory('cedarInfiniteScrollDirective', function () {
        return {};
      });
    }));

    beforeEach(inject(
        function (_$rootScope_, _$compile_, _$controller_, _$httpBackend_,_$timeout_,
                  _UIMessageService_,  _UrlService_,_resourceService_, _UISettingsService_, _QueryParamUtilsService_) {
          $rootScope = _$rootScope_.$new(); // create new scope
          $compile = _$compile_;
          $controller = _$controller_;
          $httpBackend = _$httpBackend_;
          UIMessageService = _UIMessageService_;
          UrlService = _UrlService_;
          resourceService = _resourceService_;
          UISettingsService = _UISettingsService_;
          QueryParamUtilsService = _QueryParamUtilsService_;
          $timeout = _$timeout_;
        }));

    beforeEach(function () {
      http.init($httpBackend);
      http.getFile('resources/i18n/locale-en.json');
      http.getFile('config/url-service.conf.json?v=undefined');
      http.getFile('img/plus.png');
      http.getFile('img/close_modal.png');
      http.getUrl(UrlService.base(), 'messaging', '/summary');
    });

    describe('In a template,', function () {
      describe('a new folder modal ', function () {

        var $newFolderScope;
        var newFolderDirective;
        var newFolderButton = "#new-folder-modal .modal-footer .clear-save button";
        var xGoAway = "#new-folder-modal #new-folder-modal-header.modal-header .button.close";
        var newFolderTitle = "#new-folder-modal #new-folder-modal-header .modal-title";



        beforeEach(function () {
          // create a new, isolated scope and a new directive
          $newFolderScope = $rootScope.$new();
          newFolderDirective = '<cedar-new-folder-modal  modal-visible="newFolderModalVisible" ></cedar-new-folder-modal>';
          newFolderDirective = $compile(newFolderDirective)($newFolderScope);
          $newFolderScope.$digest();
        });

        it("should have a copy button and close x ", function () {
          var elm = newFolderDirective[0];
          expect(elm.querySelector(newFolderButton)).toBeDefined();
          expect(elm.querySelector(xGoAway)).toBeDefined();
        });

        it("should have a header with the current folder name ", function () {
          var elm = newFolderDirective[0];
          expect(elm.querySelector(newFolderTitle)).toBeDefined();
          console.log(elm.querySelector(newFolderTitle));
        });


      });
    });


  });
});
