(function ($, window, amplify, CStudioAuthoring) {
    'use strict';

    var cstopic = crafter.studio.preview.cstopic;
    var Topics = crafter.studio.preview.Topics;
    var origin = window.location.origin; // 'http://127.0.0.1:8080';
    var communicator = new crafter.studio.Communicator(origin);
    // CStudioAuthoring.Utils.Cookies.readCookie('crafterSite')

    communicator.subscribe(Topics.GUEST_CHECKIN, function (url) {
        var site = CStudioAuthoring.Utils.Cookies.readCookie('crafterSite');
        var params = {
            page: url,
            site: site
        };
        setHash(params);
        amplify.publish(cstopic('GUEST_CHECKIN'), params);
    });

    communicator.subscribe(Topics.GUEST_CHECKOUT, function () {
        // console.log('Guest checked out');
    });

    communicator.subscribe(Topics.ICE_ZONE_ON, function (message, scope) {

        var editCb = { 
            success:function() {
                CStudioAuthoring.Operations.refreshPreview(); 
            }, 
            failure: function() {
            }  
        };
        
        if (!message.itemId) {
            // base page edit
            CStudioAuthoring.Operations.performSimpleIceEdit(
                CStudioAuthoring.SelectedContent.getSelectedContent()[0],
                message.iceId, //field
                true,
                editCb, []);
        } else {
            var getContentItemsCb = {
                success: function (contentTO) {
                    CStudioAuthoring.Operations.performSimpleIceEdit(
                        contentTO.item,
                        this.iceId, //field
                        true,
                        this.editCb,
                        []);
                },

                failure: function () {
                    callback.failure();
                },
                iceId: message.iceId,
                editCb: editCb
            };
                    
            CStudioAuthoring.Service.lookupContentItem(
                CStudioAuthoringContext.site, 
                message.itemId, 
                getContentItemsCb, 
                false, false);

        }

    });

    // Listen to the guest site load
    communicator.subscribe(Topics.GUEST_SITE_LOAD, function (message, scope) {

        if (message.url) {
            var params = {
                page:message.url,
                site: CStudioAuthoring.Utils.Cookies.readCookie('crafterSite')
            };
            setHash(params);
            amplify.publish(cstopic('GUEST_SITE_LOAD'), params);
        }

        // Once the guest window notifies that the page as successfully loaded,
        // add the guest window as a target of messages sent by this window
        communicator.addTargetWindow({
            origin: origin,
            window: getEngineWindow().contentWindow
        });

    });

    communicator.subscribe(Topics.STOP_DRAG_AND_DROP, function () {
        CStudioAuthoring.PreviewTools.panel.show();
        YDom.replaceClass('component-panel-elem', 'expanded', 'contracted');
    });

    communicator.subscribe(Topics.COMPONENT_DROPPED, function (message) {
        amplify.publish(cstopic('COMPONENT_DROPPED'),
            message.type,
            message.path,
            message.isNew,
            message.trackingNumber,
            message.zones);
    });

    communicator.subscribe(Topics.SAVE_DRAG_AND_DROP, function (message) {
        amplify.publish(cstopic('SAVE_DRAG_AND_DROP'),
            message.isNew,
            message.zones);
    });

    communicator.subscribe(Topics.INIT_DRAG_AND_DROP, function (message) {
        amplify.publish(cstopic('INIT_DRAG_AND_DROP'),
            message.zones);
    });

    amplify.subscribe(cstopic('REFRESH_PREVIEW'), function () {
        communicator.publish(Topics.REFRESH_PREVIEW);
    });

    var initialContentModel;
    amplify.subscribe(cstopic('START_DRAG_AND_DROP'), function (config) {
        CStudioAuthoring.PreviewTools.panel.hide();

        var data;
        if (config.components.category){
            data = config.components.category;
        }else{
            data = config.components;
        }
        var categories = [];

        if ($.isArray(data)) {
            $.each(data, function(i, c) {
                if(c.component){
                    categories.push({ label: c.label, components: c.component });
                }else{
                    categories.push({ label: c.label, components: c.components });
                }

            });
        } else {
            if(data.component) {
                categories.push({ label: data.label, components: data.component });
            }else{
                categories.push({ label: data.label, components: data.components });
            }
        }

        communicator.publish(Topics.START_DRAG_AND_DROP, {
            components: categories,
            contentModel: initialContentModel
        });

    });

    amplify.subscribe(cstopic('CHANGE_GUEST_REQUEST'), function (url) {
       // console.log(arguments);
    });

    amplify.subscribe(cstopic('DND_COMPONENT_MODEL_LOAD'), function (data) {
        communicator.publish(Topics.DND_COMPONENT_MODEL_LOAD, data);
    });

    amplify.subscribe(cstopic('DND_COMPONENTS_MODEL_LOAD'), function (data) {
        initialContentModel = data;
        communicator.publish(Topics.DND_COMPONENTS_MODEL_LOAD, data);
    });

    amplify.subscribe(cstopic('ICE_TOOLS_OFF'), function (){
        communicator.publish(Topics.ICE_TOOLS_OFF);
    });

    amplify.subscribe(cstopic('ICE_TOOLS_ON'), function (){
        communicator.publish(Topics.ICE_TOOLS_ON);
    });

    function setHashPage(url) {
        window.location.hash = '#/?page=' + url;
    }

    function setHash(params) {
        var hash = [];
        for (var key in params) {
            hash.push(key + '=' + params[key]);
        }
        CStudioAuthoringContext && (CStudioAuthoringContext.previewCurrentPath = params.page);
        window.location.hash = '#/?' + hash.join('&');
    }

    function getEngineWindow() {
        return document.getElementById('engineWindow');
    }

    function goToHashPage() {

        var win = getEngineWindow();
        var hash = parseHash(window.location.hash);
        var site = CStudioAuthoring.Utils.Cookies.readCookie('crafterSite');
        var siteChanged = false;

        if (hash.site) {
            CStudioAuthoring.Utils.Cookies.createCookie('crafterSite', hash.site);
            siteChanged = (site !== hash.site);
        }

        setTimeout(function () {
            // TODO this thing doesn't work well if document domain is not set on both windows. Problem?
            if (siteChanged || (
                win.src.replace(origin, '') !== hash.page &&
                win.contentWindow.location.href.replace(origin, '') !== hash.page)) {
                win.src = hash.page;
            }
        });

        var path = ('/site/website/' + ((hash.page.indexOf('.html') !== -1)
            ? hash.page.replace('.html', '.xml')
            : hash.page+'/index.xml')).replace('//','/');
        CStudioAuthoring.Service.lookupContentItem(CStudioAuthoringContext.site, path, {
            success: function(content) {
                CStudioAuthoring.SelectedContent.setContent(content.item);
            }
        });

    }

    // TODO better URL support. Find existing lib, use angular or use backbone router?
    function parseHash(hash) {

        var str = hash.replace('#/', ''),
            params = {},
            param;

        str = str.substr(str.indexOf('?') + 1);
        str = str.split('&');

        for (var i = 0; i < str.length; ++i) {
            param = str[i].split('=');
            params[param[0]] = param[1];
        }

        return params;

    }

    window.addEventListener("hashchange", function (e) {
        e.preventDefault();
        goToHashPage();
    }, false);

    window.addEventListener('load', function () {

        if (window.location.hash.indexOf('page') === -1) {
            setHash({
                page: '/',
                site: CStudioAuthoring.Utils.Cookies.readCookie('crafterSite')
            });
        } else {
            goToHashPage();
        }

    }, false);

}) (jQuery, window, amplify, CStudioAuthoring);