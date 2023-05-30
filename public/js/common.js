/* global EmailExt, tinymce, UploadTypeObj, DbModelObj, DbModel_CustomSaveFunc,
 DbModelForm_Init, DATETIME_PICKER_VER, UploadTypeSingle, UploadTypeMulti,
 UploadTypeImage, PageUrlTree, vkThread, dtTableIds, ORIGINAL_URL, UseRewriteAct */
 USE_BS_UI = false;
 USE_BS_UI_4 = false;
 PAGE_ICON = '';
 Common = {};
 Tarih = {};
 Page = {};
 Table = {};
 Jui = {};
 BSui = {};
 Mask = {};
 Thread = {};
 var CurrentMenu = null;
 var CurrentContainer = null;
 Page.UseSwal = true;
 Page.UseSwalV2 = false;
 
 var COMMONLANG = {
     DESC : 'Açıklama',
     DELETE : 'Sil',
     SAVE : 'Kaydet',
     ERROR : 'Hata',
     CANCEL : 'Vazgeç',
     CLOSE : 'Kapat',
     OK : 'Tamam',
     DOWNLOAD_PREPARED : 'İndirme hazırlanıyor...',
     DELETE_CONFIRMATION : 'Seçili kaydı silmek istediğinize emin misiniz?',
     DELETE_INPROGRESS : 'Kayıt siliniyor. Lütfen bekleyiniz...',
     NOT_PROPER_CONDITION : '{0} düzgün bir şart değil',
     WORKING_DAYS : 'iş günü',
     HOUR : 'saat',
     MINUTE: 'dakika',
     SAVING : 'Kaydediliyor',
     LOADING: 'Yükleniyor',
     DELETING : 'Siliniyor',
     SENDING: 'Gönderiliyor',
     UPDATING : 'Güncelleniyor',
     PROCESS_IN_PROGRESS : 'İşleminiz devam ediyor, lütfen bekleyiniz.',
     PROCESS_COMPLETED : 'İşleminiz başarıyla tamamlandı',
     INFORMATION : 'Bilgilendirme',
     SUCCESS : 'Başarılı',
     WARNING : 'Uyarı',
     CONFIRMATION : 'Onaylama',
     YES : 'Evet',
     NO : 'Hayır',
     ENTER_VALID_VALUE : "Lütfen geçerli bir değer giriniz.",
     FILE_BEING_GENERATED : 'Dosya oluşturuluyor',
     TABLE_IS_SORTABLE : 'Bu tablodaki veriler sürükle-bırak ile sıralanabilinmektedir',
     FIELD_VALID_DATE : '{0} alanına geçerli bir tarih yazmanız gerekmektedir',
     FIELD_VALID_VALUE : '{0} alanına geçerli bir değer girmeniz gerekmektedir',
     FIELD_MANDATORY : '{0} alanını doldurmak zorunludur',
     INPUT_ERROR : "Hatalı bilgi girişi bulunmaktadır, lütfen düzeltiniz",
     MISSING_INPUTS : 'Doldurulması zorunlu bazı alanlar boş bırakılmıştır',
     WINDOW_CLOSE_CONFIRMATION : 'Sayfadan ayrıldığınızda yapılan değişiklikler kaybedilecektir',
     PLEASE_WAIT : 'Lütfen bekleyiniz'
 };
 
 if (typeof SELECTED_LANG == 'undefined')
     SELECTED_LANG = 'tr';
 if (SELECTED_LANG == 'en')
     var COMMONLANG = {
         DESC : 'Description',
         DELETE : 'Delete',
         SAVE : 'Save',
         ERROR : 'Error',
         CANCEL : 'Cancel',
         CLOSE : 'Close',
         OK : 'OK',
         DOWNLOAD_PREPARED : 'Downloading...',
         DELETE_CONFIRMATION : 'Are you sure you want to delete the selected record?',
         DELETE_INPROGRESS : 'The record is being deleted. Please wait...',
         NOT_PROPER_CONDITION : '{0} is not a proper condition',
         WORKING_DAYS : 'working days',
         HOUR : 'hour',
         MINUTE: 'minute',
         SAVING : 'Saving',
         LOADING: 'Loading',
         DELETING : 'Deleting',
         SENDING: 'Sending',
         UPDATING : 'Updating',
         PROCESS_IN_PROGRESS : 'The process is in progress, please wait',
         PROCESS_COMPLETED : 'The process has been completed successfully',
         INFORMATION : 'Information',
         SUCCESS : 'Successful',
         WARNING : 'Warning',
         CONFIRMATION : 'Confirmation',
         YES : 'Yes',
         NO : 'No',
         ENTER_VALID_VALUE : "Please enter a valid value",
         FILE_BEING_GENERATED : 'The file is being generated',
         TABLE_IS_SORTABLE : 'The rows in this table can be sorted by dragging and dropping',
         FIELD_VALID_DATE : '{0} should be a valid date',
         FIELD_VALID_VALUE : '{0} should be a valid value',
         FIELD_MANDATORY : '{0} cannot be empty',
         INPUT_ERROR : "There is an invalid input on the form, please correct it",
         MISSING_INPUTS : 'Some mandatory fields are still empty',
         WINDOW_CLOSE_CONFIRMATION : 'If you leave the page, unsaved data will be lost',
         PLEASE_WAIT : 'Please wait'
     };
 
 String.prototype.format = function(){
    var str = this.toString();
    for(var i=0; i<arguments.length; i++){
      var re = new RegExp("\{[" + i + "]\}", "g");
      str = str.replace(re, arguments[i]);
    }
    return str;
 };
 
 
 Page.GetWindowHref = function()
 {
     var url = window.location.href;
 //	if (typeof ORIGINAL_URL != "undefined" && ORIGINAL_URL != '')
 //		url = ORIGINAL_URL;
     return url.replace(/#.*$/, '');
 };
 
 Page.GetCustomMessage = function(msg){
 
     if ($.isArray(msg)){
         var args = [];
         for(var i=1; i<msg.length; i++)
             args.push(msg[i]);
         msg = vsprintf(Page.CustomMessages[msg[0]], args);
     }
     return msg;
 };
 
 Page.Download = function(url, width, height, forceDownload){
     if (typeof forceDownload != 'undefined' && forceDownload != false)
     {
         var a = $('A#tempDownloadLink');
         if (a.length == 0)
             a = $('<a>')
                 .attr('id', 'tempDownloadLink')
                 .css('opacity', 0)
                 .text('download')
                 .appendTo('body');
         // <a href="iphone_user_guide.pdf" download="iPhone User's Guide.PDF">click me</a>
         var download = typeof forceDownload == 'string' ? forceDownload.substring(0, 48) : url;
         return a.attr({href: url, download: download}).get(0).click();
     }
 
     if (url.match(/[;|]/) || ! url.match(/\.(pdf|jpe?g|png|gif|txt|mp4|mov)$/i))
     {
         Page.ShowProcessingMessage('body', COMMONLANG.DOWNLOAD_PREPARED);
         var ifr = $('IFRAME.download');
         if (ifr.length > 0)
             ifr.remove();
         $('<iframe class="download" onload="Page.CloseProcessingMessage();">')
             .attr('src', url)
             .appendTo('body').hide();
         if($.browser.chrome)
             setTimeout(function(){Page.CloseProcessingMessage();},5*1000);
         return true;
     }
 
     Page.OpenNewWindow(url, 'download', width, height);
 };
 
 Mask.IntPhone = function (selector)
 {
     if (!is_set(selector))
         selector = '.IntPhone';
     $(selector).each(function () {
         if (! $(this).hasClass('.IntPhone'))
             return;
         $(this).intlTelInput({
             autoHideDialCode: false,
             autoPlaceholder : 'aggressive',
             initialCountry: 'GB',
             preferredCountries : ['GB', 'US'],
             separateDialCode : true,
             formatOnDisplay: true
         })
         .on('blur', function(){
             var obj = $(this);
             if (obj.val().trim())
             {
                 if (! obj.intlTelInput("isValidNumber"))
                     obj.css('border', '1px solid red');
                 else
                     obj.css('border', '');
 
             }
         })
         .on('countrychange', function(){
             if (true)
                 return;
             var maskVal = $(this).attr('placeholder').replace(/[0-9]/g, "9");
             $(this).val('');
             $(this).mask(maskVal);
         });
         var that = this;
         $(this).data('plugin_intlTelInput').promise.then(function(){
             $(that).css('padding-left', '6em');
             /*
             var maskVal = $(that).attr('placeholder').replace(/[0-9]/g, "9");
             $(that).mask(maskVal);
             */
         });
     });
 }

 Page.GetParameters = function (url, ignore) {
     if (!is_set(url))
     {
         url = Page.GetWindowHref();
         if (typeof ORIGINAL_URL != 'undefined' && ORIGINAL_URL)
             url = ORIGINAL_URL;
     }
     if (!is_set(ignore))
         ignore = [];
     if (!$.isArray(ignore))
         ignore = [ignore];
     var parts = url.split('?');
     var sonuc = new Object();
     if (parts.length <= 1)
         return sonuc;
     var params = parts[1].split('&');
     for (var i = 0; i < params.length; i++)
     {
         var p = params[i].split('=');
         if (p.length == 2 && p[1] && $.inArray(p[0], ignore) < 0)
         {
             p[1] = String(p[1]).replace(/[+]/g, ' ');
             sonuc[p[0]] = unescape(decodeURIComponent(p[1]));
         }
     }
     return sonuc;
 };
 
 if (typeof $.browser == "undefined")
     $.browser = {};
 $.browser.chrome = /chrom(e|ium)/.test(navigator.userAgent.toLowerCase());
 window.oldDecode = decodeURIComponent;
 window.decodeURIComponent = function (str) {
     if (typeof str != "string")
         return window.oldDecode(str);
     var table = {};
     table['%DE'] = 'Ş';
     table['%FE'] = 'ş';
     table['%DD'] = 'İ';
     table['%FD'] = 'ı';
     table['%D0'] = 'Ğ';
     table['%F0'] = 'ğ';
     table['%DC'] = 'Ü';
     table['%FC'] = 'ü';
     table['%C7'] = 'Ç';
     table['%E7'] = 'ç';
     table['%D6'] = 'Ö';
     table['%F6'] = 'ö';
     for (var code in table)
     {
         var r = new RegExp(code, 'ig');
         str = str.replace(r, table[code]);
     }
     try {
         str = oldDecode(str);
     } catch (e) {
     }
     return str;
 };
 
 Page.Params = Page.GetParameters();
 
 var STYLIZE_INPUTS = true;
 $(function () {
     console.time('common');
     if (USE_BS_UI || USE_BS_UI_4)
         $('body').addClass('mode-bs');
 
     // Bazı sayfalarda "mask" yerine "inputmask" yükleniyor
     if ((typeof jQuery.fn.mask == "undefined") && (typeof jQuery.fn.inputmask == 'function'))
         jQuery.fn.mask = jQuery.fn.inputmask;
 
     if (typeof DbModelForm_Init == 'function')
         DbModelForm_Init();
     // Sayfa Başlıklarını ayarla
     $('<span style="float:left" class="ui-icon ui-icon-signal-diag"></span>').appendTo($('.ers-page-header'));
     $('.ers-page-header').addClass('ui-widget-header ui-helper-clearfix ui-corner-all');
     $('.yetkisiz').find('INPUT,TEXTAREA,BUTTON').attr('disabled', 'disabled');
 
     $("[use_default_button] input").keypress(function (e) {
         if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
             $(this).change();
             $($(this).parents('[use_default_button]').get(0)).find('[default_button]').first().click();
             return false;
         } else {
             return true;
         }
     });
 
     $('SELECT[page-refresh="1"],INPUT[page-refresh="1"]').each(function(){
         var param = $(this).attr('page-param');
         if (!param)
             param = $(this).attr('id');
         var pval = Page.GetParameter(param);
         if (pval)
         {
             pval = decodeURIComponent(pval.replace(/\+/gm,"%20"));
             $(this).val(pval);
             if ($(this).hasClass('selectpicker'))
                 $(this).selectpicker('refresh');
         }
     }).change(Page.RefreshUrl);
 
     Mask.Telefon();
     Mask.IntPhone();
     Mask.InitMask();
     Jui.InitInputs();
     Jui.InitButtons();
     Jui.InitTables();
     Jui.InitPages();
 
     $('A.download').click(function(evt){
         var href = $(this).attr('href');
         Page.Download(href);
         evt.stopPropagation();
         return false;
     });
 
     var sc = Page.GetParameter('scroll');
     if (sc != '')
         $(document).scrollTo(parseInt(sc), 'slow');
 
     var bsTabs = Page.GetParameter('bs-tabs');
     if (bsTabs)
     {
         bsTabs = bsTabs.split(',');
         var uls = $('UL.nav-ers-tab LI.active').closest('UL');
         for (var i=0; i < bsTabs.length; i++)
             uls.eq(i).find('>LI').eq(bsTabs[i]).find('>a').tab('show');
         $('.card-toolbar UL.nav LI.nav-item:eq(' + bsTabs[0] + ') > A').click();
     }
 
     // Form default düğme ayarlanması
     var forms = $('FORM');
     for (var i = 0; i < forms.length; i++)
     {
         var f = forms.get(i);
         if (f.action == '')
             f.action = 'index.php';
         if (typeof $(f).attr('use_default_button') === "undefined")
             $(f).attr('use_default_button', '1');
         for (var k = 1; k <= 4; k++)
         {
             var act = 'act' + (k > 1 ? k : '');
             var val = Page.GetParameter(act);
             if (typeof f.elements[act] != "undefined" || !val)
                 continue;
             $('<INPUT type="hidden" />').
                     attr('name', act).val(val).
                     appendTo(f);
         }
     }
     // Disable edilmesi gereken elemanlar ayarlanıyor
     $('.disable_inputs').each(function(){
         $(this).find('INPUT,SELECT,TEXTAREA').attr('disabled', 'disabled');
         $(this).find('.ui-button').button('disable').attr('onclick', '');
     });
     console.timeEnd('common');
 });
 
 tabberOptions = {
     onLoad: function (argsObj) {
         var s = Page.GetParameter('tab');
         if (s != '')
             argsObj.tabber.tabShow(parseInt(s));
     }
 };
 
 function Id(id)
 {
     var obj = document.getElementById(id);
     if (obj)
         return obj;
     return $(id);
 }
 
 function GenerateCp()
 {
     if (typeof cp == "undefined")
     {
         cp = new cpaint();
         cp.set_transfer_mode('post');
         cp.set_response_type('text');
     }
     return cp;
 }
 
 function is_set(val)
 {
     return (typeof val != "undefined");
 }
 
 function is_null(val, defVal)
 {
     return (typeof val != "undefined") && val != null ?  val : defVal;
 }
 
 function ifEmpty(val, defVal)
 {
     return val ? val : defVal;
 }
 
 function CheckVar(val, defVal)
 {
     if (typeof defVal == "undefined")
         defVal = null;
     if (typeof val == "undefined")
         return defVal;
     return val;
 }
 
 /**
  *
  * @param {string} url verilen kıssa adres bilgisini tam adrese çevirir.
  * Örn: "admin.projeler" => "index.php?act=admin&act2=projeler"
  * @param mode
  * @param ajax
  * @returns {string}
  */
 function GetUrl(url, mode, ajax, ext) {
     var str = ['act', 'act2', 'act3', 'act4'];
     // Göreceli adres mi?
     if (url[0] == '#')
     {
         var p = '';
         for (var i = 0; i <= 3; i++)
         {
             var a = Page.GetParameter(str[i]);
             if (!a)
                 break;
             p += a + '.';
         }
         url = p + url.substr(1);
     }
     var acts = url.split('.');
     var sonuc = [];
     var usePath = UseRewriteAct == '1';
     if (usePath && acts.length > 0 && (acts[0] == 'developer'
             || acts[0] == 'db_model' || acts[0] == 'debug') )
         usePath = false;
     var splitter = usePath ? '/' : '&';
     for (var i = 0; i < acts.length; i++)
         if (i <= 3 && acts[i].indexOf('=') < 0)
             sonuc.push((usePath ? '' : str[i] + '=') + acts[i]);
         else
             sonuc.push(acts[i]);
     if (is_set(mode) && mode)
         sonuc.push('mode=' + mode);
     if (is_set(ajax) && ajax)
         sonuc.push('ajax=' + ajax);
     var baseUrl = window.location.protocol + "//" + window.location.hostname + window.location.pathname;
     if(typeof CALISMA_URL != 'undefined' && CALISMA_URL != '')
         baseUrl = CALISMA_URL;
     if (ext && ext.HTTPS)
         baseUrl = baseUrl.replace('http:', 'https:');
     var qryPrm = '';
     if (sonuc != '')
         qryPrm = usePath ? 'act/' : '?';
     if (typeof ext == 'string' && ext)
         sonuc.push(ext);
     else if (typeof ext == 'object')
         for (var e in ext)
         {
             if (typeof ext[e] == 'object')
                 ext[e] = -1;
             var param = e + '=' + ext[e];
             if (sonuc.indexOf(param) < 0)
                 sonuc.push(param);
         }
     return baseUrl + qryPrm + sonuc.join(usePath ? '/' : '&');
 }
 
 PageDeleteRecord = function (id, pagedFuncName, url, params)
 {
     if (typeof pagedFuncName != 'string')
         pagedFuncName = 'DeleteRecord';
     if (typeof url != 'string')
         url = '';
     var cb = function (resp) {
         if (resp != 1)
             Page.ShowError(resp);
         else
             Page.Refresh();
     };
     id = params || id;
     Page.ShowConfirm(COMMONLANG.DELETE_CONFIRMATION,
             function () {
                 Page.Ajax.Get(url).Send(pagedFuncName, id, cb, COMMONLANG.DELETE_INPROGRESS);
             }
     );
 };
 
 function HighlightField(obj, parent, msg)
 {
     Form.ActiveBsTabs(obj);
     obj = $(obj);
     var div = obj.closest('.ui-tabs');
     if (div.length > 0)
     {
         var index = obj.closest('DIV.ui-tabs-panel').index();
         div.tabs({active: index - 1});
     }
     if (is_set(parent) && typeof parent == "string")
     {
         msg = parent;
         parent = null;
     }
     if (!is_set(parent) || !parent)
         parent = window;
     var fn = function () {
         if (obj.attr('rich_edit') == 1)
         {
             tinymce.execCommand('mceFocus', false, obj.attr('id'));
             var tinObj = tinymce.get(obj.attr('id'));
             obj = tinObj.contentAreaContainer;
             $(tinObj.getBody()).css({backgroundColor: 'pink'});
             setTimeout(function(){
                 $(tinObj.getBody()).css({backgroundColor: 'white'})
             }, 1000);
         }
         else if (obj.prop('tagName') == 'SELECT' && obj.siblings('.chosen-container').length > 0)
         {
             obj = obj.siblings('.chosen-container').find('INPUT:first').focus();
         }
         else
         {
             if (obj.hasClass('rich_edit_div') || obj.hasClass('textarea_list'))
                 obj = obj.parent();
             $(obj).focus();
             $(obj).select();
             $(obj).effect("highlight", {color: 'pink'}, 3000);
         }
         $(parent).scrollTo(obj, 100, {offset: -$(parent).height() / 2});
     };
     if (msg)
         Page.ShowWarning(msg, fn);
     else
         fn();
     return null;
 }
 
 function FileSizeStr(bytes)
 {
     var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
     if (bytes == 0)
         return 'n/a';
     else if (isNaN(bytes))
         return bytes;
     var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
     return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
 }
 
 function ArrayToObject(arr)
 {
     var rv = {};
     for (var i = 0; i < arr.length; ++i)
         rv[i] = arr[i];
     return rv;
 }
 
 (function ($)
 {
     $.fn.getList = function (attrName)
     {
         return $(this).map(function () {
             return attrName ? $(this).attr(attrName) : $(this).val();
         }).get();
     };
 
     $.fn.valNum = function (val)
     {
         if (is_set(val))
             return $(this).autoNumeric('set', val);
         return $(this).autoNumeric('get');
     };
 
     /**
      * Şarta bağlı olarak obj nin görünümünü değiştirir ve bu bunları birbirine bağlar.
      * @param {string} cond
      * @param {bool} slider
      * @return {jQuery}
      */
     $.fn.CondVisible = function (cond, slider)
     {
         var patern = />=|<=|!=|==|>|</;
         var parts = cond.split(patern);
         if (parts.length != 2)
             return alert(COMMONLANG.NOT_PROPER_CONDITION.format(cond));
         var opt = cond.match(patern);
         var obj = $(this);
         $(parts[0]).change(function () {
             var vis = eval('$(this).val() ' + opt + ' parts[1];');
             if (slider)
                 vis ? obj.slideDown() : obj.slideUp();
             else
                 obj.toggle(vis);
         }).change();
         return this;
     };
 
     $.fn.FilterInputVal = function (empty){
         return $(this).filter(function(){
             if (empty)
                 return !$(this).val();
             else
                 return $(this).val();
         })
     }
 })(jQuery);
 
 Cookie = {};
 Cookie.set = function (cname, cvalue)
 {
     var now = new Date();
     var time = now.getTime();
     var expireTime = time + 30 * 24 * 60 * 60 * 1000;
     now.setTime(expireTime);
     document.cookie = cname + "=" + cvalue + ";path=/;expires=" + now.toGMTString() + ";";
 };
 
 Cookie.get = function (cname)
 {
     var name = cname + "=";
     var ca = document.cookie.split(';');
     for (var i = 0; i < ca.length; i++)
     {
         var c = ca[i].trim();
         if (c.indexOf(name) == 0)
             return c.substring(name.length, c.length);
     }
     return "";
 };
 
 Cookie.setElementsValue = function (cname, ids)
 {
     var cbx = $('#' + cname).is(':checked') ? 1 : 0;
     ids = cname + ',' + ids;
     ids = ids.split(',');
     var obj = {};
     for (var i = 0; i < ids.length; i++)
     {
         var inp = $('#' + ids[i]);
         obj[ids[i]] = inp.val();
     }
     obj = JSON.stringify(obj);
     if (!cbx)
         obj = '';
     Cookie.set(cname, obj);
 };
 
 Cookie.getElementsValue = function (cname)
 {
     var obj = Cookie.get(cname);
     if (obj == '')
         return;
     obj = JSON.parse(obj);
     for (var id in obj)
     {
         var inp = $('#' + id);
         if (inp.prop('tagName') == 'INPUT' && inp.attr('type') == 'checkbox')
             inp.attr('checked', obj[id] == 'on' ? 'checked' : '');
         else
             inp.val(obj[id]);
     }
 };
 
 /**
  * UI erişimi olmayan bir fonksiyonun ayrı bir thread
  * içinde çalışmasını sağlar
  * @param func function
  * @param funcParams object
  * @param returnCallback function
  * @param importFiles object
  * @returns
  */
 Thread.Exec = function(func, funcParams, returnCallback, importFiles){
     if (typeof ssvkthread == "undefined" || typeof Worker == "undefined")
     {
         var resp = func.apply(undefined, funcParams);
         return returnCallback(resp);
     }
     var param = {
           fn: func,
           args: funcParams,
           importFiles : importFiles
         };
     /* run thread */
     vkthread.exec(param).then(returnCallback);
 };
 
 Mask.InitMask = function(selector)
 {
     if (!is_set(selector))
         selector = document;
     $(selector).find('[var_mask]').each(function () {
         if (!$(this).hasClass('hasMask'))
             $(this).mask($(this).attr('var_mask')).addClass('hasMask');
     });
 };
 
 Mask.Telefon = function (selector)
 {
     if (!is_set(selector))
         selector = '.Telefon';
     $(selector).each(function () {
         if (! $(this).hasClass('Telefon'))
             return;
         if (!$(this).hasClass('hasMask'))
             $(this).mask('(999)999-9999').addClass('hasMask');
     });
 };
 
 
 Mask.Date = function (selector)
 {
     if (!is_set(selector))
         selector = '[date_selector="1"],[var_type=date]';
     $(selector).each(function () {
         if ($(this).attr('date_selector') != '1' && $(this).attr('var_type') != 'date')
             return;
         if (!$(this).hasClass('hasMask'))
             $(this).mask('99-99-9999').addClass('hasMask');
     });
 };
 
 Mask.SaatDakika = function (selector)
 {
     if (!is_set(selector))
         selector = '.SaatDakika';
     $(selector).each(function () {
         if (! $(this).hasClass('.SaatDakika'))
             return;
         if (!$(this).hasClass('hasMask'))
             $(this).mask('99:99').addClass('hasMask');
     });
 };
 
 Tarih.Aylar = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
     'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
 
 Tarih.AylarKisa = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz',
     'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
 if (SELECTED_LANG == 'en')
 {
     Tarih.Aylar = ['January', 'February', 'March', 'April', 'May', 'June',
         'July', 'August', 'September', 'October', 'November', 'December'];
 
     Tarih.AylarKisa = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
         'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
 }
 Tarih.AylarSayi = ['01', '02', '03', '04', '05', '06',
     '07', '08', '09', '10', '11', '12'];
 
 Tarih.Kontrol = function (tarih, icerikKontrol) {
     if (!tarih)
         return false;
     icerikKontrol = icerikKontrol || false;
     var ifade = /^([0-9]{1,2})\-([0-9]{1,2})\-([0-9]{4})/;
     var bol = tarih.split(" ");
     if (bol.length == 2)
         ifade = /^([0-9]{1,2})\-([0-9]{1,2})\-([0-9]{4})\s([0-9]{1,2})\:([0-9]{1,2})/;
     var format = tarih.match(ifade);
     if (!format || !icerikKontrol)
         return format;
     var utcTarih = format[3] + '-' + format[2] + '-' + format[1];
     if (bol.length == 2)
         utcTarih += " " + format[4] + ':' + format[5];
     var date = Date.parse(utcTarih);
     return !isNaN(date);
 };
 
 
 Tarih.Bugun = function () {
     return Tarih.DateToStr(new Date());
 };
 
 Tarih.SimdiSaat = function () {
     var dateObj =  new Date();
     var h = dateObj.getHours();
     var i = dateObj.getMinutes();
     var s = dateObj.getSeconds();
 
     if (h < 10)
         h = '0' + h;
     if (i < 10)
         i = '0' + i;
     if (s < 10)
         s = '0' + s;
     return  h + ":" + i + ":" + s;
 };
 
 /**
  * @param {string} tarih
  * @returns {Date}
  */
 Tarih.StrToDate = function (tarih)
 {
     var part = tarih.split(" ");
     tarih = part[0];
     if (!tarih.match(/^[0-9]{1,2}\-[0-9]{1,2}\-[0-9]{4}$/))
         return null;
     var parts = tarih.split('-');
 
     // Baştaki "0"lar parseInt sırasında problem çıkarabiliyor
     if (parts[0].charAt(0) == '0')
         parts[0] = parts[0].charAt(1);
     if (parts[1].charAt(0) == '0')
         parts[1] = parts[1].charAt(1);
     if (parseInt(parts[1]) == 0 || parseInt(parts[0]) == 0)
         return -1;
     if (part.length == 2)
     {
         var saat = part[1];
         if (!saat.match(/^[0-9]{1,2}\:[0-9]{1,2}(\:[0-9]{1,2})?$/))
             return null;
 
         var zaman_part = saat.split(':');
         if (zaman_part[0].charAt(0) == '0')
             zaman_part[0] = zaman_part[0].charAt(1);
         if (zaman_part[1].charAt(0) == '0')
             zaman_part[1] = zaman_part[1].charAt(1);
         if (typeof zaman_part[2] == "undefined")
             zaman_part.push(0);
         else if (zaman_part[2].charAt(0) == '0')
             zaman_part[2] = zaman_part[2].charAt(1);
     }
     else
         zaman_part = [0, 0, 0];
 
     return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]),
             parseInt(zaman_part[0]), parseInt(zaman_part[1]), parseInt(zaman_part[2]));
 };
 
 
 Tarih.DateDiff = function (tarih1, tarih2)
 {
     if (typeof tarih1 == "string")
         tarih1 = Tarih.StrToDate(tarih1);
     if (typeof tarih2 == "string")
         tarih2 = Tarih.StrToDate(tarih2);
     var fark = (tarih2 - tarih1) / 1000.0;
     return parseInt(Math.ceil(fark / (60 * 60 * 24)));
 };
 
 Tarih.PreciseDiff = function (tarih1, tarih2)
 {
     if (typeof tarih1 == "string")
         tarih1 = Tarih.StrToDate(tarih1);
     if (typeof tarih2 == "string")
         tarih2 = Tarih.StrToDate(tarih2);
     var fark = (tarih2 - tarih1) / 1000.0;
     var gun = 0;
     var saat= 0;
     var dakika = 0;
     var saniye = 0;
     if (fark > 60 * 60 * 24)
     {
         gun = parseInt(fark / (60 * 60 * 24));
         fark -= gun * (60 * 60 * 24);
     }
     if (fark > 60 * 60)
     {
         saat = parseInt(fark / (60 * 60));
         fark -= saat * (60 * 60);
     }
     if (fark > 60)
     {
         dakika = parseInt(fark / 60);
         fark -= dakika * 60;
     }
     if (fark > 0)
         saniye = parseInt(fark);
     return [gun, saat, dakika, saniye];
 };
 
 
 Tarih.MonthDiff = function (d1, d2)
 {
     if (typeof d1 != "object")
         d1 = Tarih.StrToDate(d1);
     if (typeof d2 != "object")
         d2 = Tarih.StrToDate(d2);
     var months;
     months = (d2.getFullYear() - d1.getFullYear()) * 12;
     months -= d1.getMonth();
     months += d2.getMonth();
     return months;
 };
 
 Tarih.DateAdd = function (tarih, gun, tur)
 {
     if (typeof tarih == "string")
         tarih = Tarih.StrToDate(tarih);
     if (typeof tur == "undefined")
         tur = 1;
     gun = parseInt(gun);
     switch (tur)
     {
         case 30	:
             tarih.setMonth(tarih.getMonth() + gun);
             break;
         case 365:
             tarih.setFullYear(tarih.getFullYear() + gun);
             break;
         default:
             tarih.setDate(tarih.getDate() + gun);
     }
     return Tarih.DateToStr(tarih);
 };
 
 Tarih.HourAdd = function (tarih, saat)
 {
     if (typeof tarih == "string")
         tarih = Tarih.StrToDate(tarih);
     saat = parseInt(saat);
     tarih.setHours(tarih.getHours() + saat);
 
     return Tarih.DateToStr(tarih) + " " + Tarih.TimeToStr(tarih);
 };
 
 Tarih.TimeToStr = function (dateObj)
 {
     dateObj = dateObj || new Date();
     var h = dateObj.getHours();
     var i = dateObj.getMinutes();
 
     if (h < 10)
         h = '0' + h;
     if (i < 10)
         i = '0' + i;
 
     return  h + ":" + i;
 };
 
 Tarih.DateToStr = function (dateObj)
 {
     dateObj = dateObj || new Date();
     var d = dateObj.getDate();
     var m = dateObj.getMonth() + 1;
     var y = dateObj.getFullYear();
     if (d < 10)
         d = '0' + d;
     if (m < 10)
         m = '0' + m;
     return d + '-' + m + '-' + y;
 };
 
 Tarih.SetDateSelector = function (container) {
     if(! $.datepicker)
         return;
     var dateObj = {
         changeMonth: true,
         changeYear: true,
         dateFormat : 'dd-mm-yy',
         onSelect: function (date) {
             var secondDate = $(this).attr('second_date');
             var secondDateObj = [];
             if (secondDate) {
                 var pr = $(this).parent();
                 while (secondDateObj.length == 0)
                 {
                     secondDateObj = pr.find(secondDate);
                     pr = pr.parent();
                     if (pr.length == 0)
                         break;
                 }// while
             }
             if (secondDateObj.length > 0)
             {
                 var date2 = Tarih.StrToDate(Tarih.DateAdd(date, 1));
                 secondDateObj
                         .datepicker('setDate', date2)
                         .datepicker('option', 'minDate', date2);
             }
             $(this).change();
         }
     };
     var yearRange = $(container).find('[date_selector="1"],[var_type=date]').attr('year_range');
     if(yearRange != "")
         dateObj.yearRange = yearRange;
     $(container)
         .find('[date_selector="1"]:not(.hasDatepicker),[var_type=date]:not(.hasDatepicker)')
         .css('width', '10em')
         .datepicker(dateObj);
     Mask.Date();
     $(container).find('[var_type=datetime]:not(.hasDatepicker)').each(function () {
         var val = $(this).val();
         if (val)
         {
             var parts = val.split(':');
             if (parts.length == 3)
             {
                 parts.splice(2);
                 $(this).val(parts.join(':'));
             }
         }
         $(this).css('width', '12em');
         if (typeof DATETIME_PICKER_VER == "undefined" || DATETIME_PICKER_VER == 1)
             $(this).datetimepicker({
                 changeMonth: true,
                 changeYear: true,
                 stepMinute: 10
             });
         else if(typeof $.datetimepicker != "undefined")
         {
             var step = $(this).attr('step') || 60;
             $(this).datetimepicker({
                 format: 'd-m-Y H:i',
                 step: step,
                 dayOfWeekStart: 1
             });
             $.datetimepicker.setLocale('tr');
         }
     });
     $(container).find('[var_type=time]').each(function () {
         $(this).timepicker({
             stepMinute: 5
         });
         var width = '6em';
         if ($(this).attr('width'))
             width = $(this).attr('width');
         $(this).css('width', width);
     });
     $(container).find('[var_type=month]').each(function () {
         $(this).monthpicker({
             pattern: 'mm-yyyy',
             startYear: $(this).attr('start-year')
         });
         var width = '8em';
         if ($(this).attr('width'))
             width = $(this).attr('width');
         $(this).css('width', width);
     });
 };
 
 Tarih.WorkTimeToStr = function (time)
 {
     if(time == 'null' || time == '')
         return '';
     var parts = time.split(':');
     var sonuc = '';
     var saat = parseInt(parts[0]);
     var gun = parseInt(saat / 8);
     saat = saat - gun * 8;
     var dk = parseInt(parts[1]);
     if (gun > 0)
         sonuc = gun + ' ' + COMMONLANG.WORKING_DAYS+ ', ';
     if (saat > 0)
         sonuc += saat + ' ' + COMMONLANG.HOUR + ', ';
     if (dk > 0)
         sonuc += dk + ' ' + COMMONLANG.MINUTE + '.';
     return sonuc;
 };
 
 Tarih.NextWeekDay = function (weekDay, date, direction)
 {
     if (typeof date == "string")
         date = Tarih.StrToDate(date);
     while (date.getDay() != weekDay)
         date.setDate(date.getDate() + direction);
     return date;
 };
 
 Tarih.SecondsToTimeStr = function(numOfSeconds)
 {
     var hours   = Math.floor(numOfSeconds / 3600);
     var minutes = Math.floor((numOfSeconds - (hours * 3600)) / 60);
     var seconds = Math.floor(numOfSeconds - (hours * 3600) - (minutes * 60));
 
     if (hours   < 10) {hours   = "0"+hours;}
     if (minutes < 10) {minutes = "0"+minutes;}
     if (seconds < 10) {seconds = "0"+seconds;}
     return hours+':'+minutes+':'+seconds;
 }
 
 jQuery(function ($) {
     if(! $.datepicker)
         return;
     $.datepicker.regional['tr'] = {
         closeText: 'kapat',
         prevText: '&#x3c;geri',
         nextText: 'ileri&#x3e',
         currentText: 'bugün',
         monthNames: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
             'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
         monthNamesShort: ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz',
             'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'],
         dayNames: ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'],
         dayNamesShort: ['Pz', 'Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct'],
         dayNamesMin: ['Pz', 'Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct'],
         weekHeader: 'Hf',
         dateFormat: 'dd-mm-yy',
         firstDay: 1,
         isRTL: false,
         showMonthAfterYear: false,
         yearRange: "c-20:c+10",
         yearSuffix: ''};
     var region = 'tr';
     if (SELECTED_LANG == 'en')
         region = 'en';
     $.datepicker.setDefaults($.datepicker.regional[region]);
 });
 
 Page.Reload = function (withActiveTabs) {
     var url = location.href;
     if (withActiveTabs)
         url = Page.UrlWithActiveTab();
     Page.Load(url);
 };
 Page.ReloadWithTabs = function (){
     Page.Reload(true);
 };
 
 Page.Refresh = function (win) {
     if (typeof win != 'object' || typeof win.document != 'object')
         win = window;
 
     if (win.lastDataTableObj && ! win.lastDataTableObj.ShowPaging)
         return win.Page.Load(Page.UrlWithActiveTab(win));
 
     if (typeof win['RefreshPageFunc'] == 'function')
         return win['RefreshPageFunc']();
 
     if (win.Page)
         return win.Page.Load(Page.UrlWithActiveTab(win));
     win.location.reload();
 };
 Page.RefreshAndClose = function () {
     var parentCb = Page.GetParameter('ParentCallback');
     if (window.parent != window &&  parentCb != '' && typeof window.parent[parentCb] == "function")
         return window.parent[parentCb]();
     Page.Refresh(opener);
     if (opener && Page.GetParameter("mode") != '')
         close();
 };
 Page.GoHome = function () {
     Page.Load('index.php');
 };
 
 Page.FindNearestPageId = function()
 {
     var pid = Page.GetParameter('__pg_id__');
     if (pid)
         return pid;
     var pageParams = Page.Params;
     var mxCnt = 0;
     for(var i in PageUrlTree)
     {
         var pg = PageUrlTree[i];
         var urlParams = Page.GetParameters(pg.url);
         var cnt = 0;
         for (var k in urlParams)
             if (urlParams[k] == pageParams[k])
                 cnt++;
         if (cnt > mxCnt)
         {
             pid = pg.id;
             mxCnt = cnt;
         }
     }
     if (! pid || (mxCnt == 1 && pageParams['act'] == 'guest'))
         pid = 'P110';
     return pid;
 };
 
 Page.Open = function (pageStr, ext, win) {
     var page = JSON.TryParse(pageStr);
     if (!page)
         page = {U: pageStr, T: 0};
     if (typeof ext == 'string' && ext)
         ext = JSON.TryParse(ext, ext);
     if (typeof ext == 'object')
     {
         page = $.extend(page, ext);
         delete ext.T;
         delete ext.W;
         delete ext.H;
     }
     var url = GetUrl(page.U, page.T == 1 ? 'clear' : '', 0, ext);
     var evnt = window.event;
     if (evnt && evnt.ctrlKey)
         return window.open(url);
     if (evnt && evnt.shiftKey)
         return window.open(url, page.N);
     win = win || window;
     if (page.T == 1)
         win = Page.OpenNewWindow(url, page.N, page.W, page.H);
     else
         win.Page.Load(url);
     if (page.W == 'full' || page.W == 0)
         win.moveTo(0, 0);
     win.blur();
     win.focus();
     return win;
 };
 
 Page.Close = function () {
     window.close();
 };
 
 Page.GetParameter = function (name, defaultVal, href, rewrite) {
     if (!is_set(defaultVal))
         defaultVal = '';
     if (!is_set(rewrite))
         rewrite=false;
     if (!href)
         return ifEmpty(Page.Params[name], defaultVal);
     name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
     var regexS = "[\\?&\/]" + name + "=([^&#\/]*)";
     var regex = new RegExp(regexS);
     var results = regex.exec(href);
     var val = '';
     if (results == null)
         val = defaultVal;
     else
         val = decodeURIComponent(results[1].replace(/\+/g, " "));
     if (! rewrite || val)
         return val;
     // rewrite olabilir ve val boş geldi
     var parts = href.split(/[\/&]/);
     var act = true;
     for(var i=0; i<parts.length; i++)
     {
         if (i == 0 && parts[i] == 'act')
         {
             act = true;
             continue;
         }
         var part = parts[i];
         var p2 = part.split('=');
         var varName = '';
         if (act && p2.length == 1)
         {
             varName = 'act' + (i == 1 ? '' : i);
             val = part;
         }
         else if (p2.length == 2)
         {
             varName = p2[0];
             val = p2[1];
         }
 
         if (varName == name)
             return val;
     }// for
 
     return defaultVal;
 };
 
 Page.GetCurrentUrl = function (add, addPath, acts) {
     if (typeof addPath == "undefined")
         addPath = true;
     if (!is_set(acts))
         acts = ['act', 'act2', 'act3', 'act4', 'mode'];
     var url = addPath ? [window.location.pathname + '?'] : [];
     for (var i = 0; i < acts.length; i++)
     {
         var act = Page.GetParameter(acts[i]);
         if (act != '')
             url.push(acts[i] + '=' + act);
     }
     if (add)
         url.push(add);
     return url.join('&');
 };
 
 Page.GetUrlWithParameters = function (important) {
     var location = Page.GetWindowHref();
     var params = Page.Params;
     for (var name in params)
     {
         var isImportant = false;
         for (var i = 0; i < important.length; i++)
         {
             var re = new RegExp(important[i] + "[1-9]?");
             if (re.test(name))
             {
                 isImportant = true;
                 break;
             }
         }
         if (!isImportant)
             location = Page.UrlChangeParam(name, '', location);
     }
     return location;
 };
 
 Page.OpenNewWindow = function (page, wname, wi, he, extra) {
     if (page.indexOf(window.location.pathname) < 0 &&
             page.indexOf('http') < 0 && page[0] != '?' &&
             page.indexOf('index.php') < 0 &&
             !page.match(/\.([a-z0-9]{3,4})$/i))
         page = GetUrl(page);
     var l = 0;
     var t = 0;
     if (typeof wi == "undefined")
         wi = 500;
     if (typeof he == "undefined")
         he = 500;
     if (wi == 'full' || wi == 0)
     {
         wi = window.screen.availWidth;
         l = 0;
     } else
         l = (window.screen.availWidth - wi) / 2;
 
     if (he == 'full' || he == 0)
     {
         he = window.screen.availHeight;
         t = 0;
     } else
         t = (window.screen.availHeight - he) / 2;
 
     if (typeof extra == "undefined")
         extra = "menubar=1,scrollbars=1,resizable=1";
     var wnd = window.open(page, wname,
             'width=' + wi + ',' +
             'height=' + he + ',' +
             'left=' + l + ',' +
             'top=' + t + ',' +
             extra
             );
     if (wnd)
     {
         wnd.blur();
         wnd.focus();
     }
     return wnd;
 };
 
 Page.SAVING_MSG = COMMONLANG.SAVING + '...';
 Page.LOADING_MSG = COMMONLANG.LOADING + '...';
 Page.DELETING_MSG = COMMONLANG.DELETING + '...';
 Page.SENDING_MSG = COMMONLANG.SENDING + '...';
 Page.UPDATING_MSG = COMMONLANG.UPDATING + '...';
 
 Page.Saving = function(){
     Page.Loading(Page.SAVING_MSG);
 }
 
 Page.Loading = function(message, progress){
     Page.ShowProcessingMessage('body', message, progress);
 };
 
 Page.Loading.Type = 0;
 
 Page.ShowProcessingMessage = function (jqSelector, message, progress) {
     if (!message)
         message = Page.LOADING_MSG;
     var obj = $(jqSelector);
     if (obj.length == 0 || obj == null)
         obj = $(jqSelector = 'body');
 
     if (typeof message != 'string')
         message = Page.LOADING_MSG;
     if (obj.hasClass('loading-show'))
     {
         obj.find('.loading-text').contents().first().replaceWith(message);
         var prg = obj.find('.progress').hide();
         if (progress > 0)
         {
             prg.show();
             prg.find('.progress-bar').width(progress + '%');
             var val = prg.find('.progress-val').html(progress + '%').removeClass('half');
             if (progress >= 50)
                 val.addClass('half');
         }
         return;
     }
     obj.addClass('loading-show');
     var loader = $('<div>').addClass('loading').appendTo(obj);
     var div1 = $('<div>').addClass('loading-center').appendTo(loader);
     var obj = $('<div>').addClass('loading-object').appendTo(div1);
     var animates = [
         function(){
             obj.addClass('animate1');
         },
         function(){
             obj.addClass('animate2');
             $('<div>').addClass('object1').appendTo(obj);
             $('<div>').addClass('object2').appendTo(obj);
             $('<div>').addClass('object-logo').appendTo(obj);
         },
         function(){
             obj.addClass('animate3');
             $('<div>').addClass('object').appendTo(obj);
             $('<div>').addClass('object').appendTo(obj);
             $('<div>').addClass('object').appendTo(obj);
             $('<div>').addClass('object').appendTo(obj);
         },
         function(){
             obj.addClass('animate4');
             $('<div>').addClass('object').appendTo(obj);
             $('<div>').addClass('object').appendTo(obj);
             $('<div>').addClass('object-logo').appendTo(obj);
         }
     ];
 //	var idx = Math.round( (animates.length - 1) * Math.random() );
 //	animates[idx]();
     animates[Page.Loading.Type]();
     var txtDiv = $('<div>').html(message).addClass('loading-text').appendTo(div1);
     if (typeof progress != "undefined")
     {
         div1.find('small').remove();
         var prg = $('<div>').addClass('progress').appendTo(txtDiv);
         $('<div>').addClass('progress-bar').width(progress + '%').appendTo(prg);
         var val = $('<div>').addClass('progress-val').html(progress + '%').appendTo(prg);
         if (progress >= 50)
             val.addClass('half');
     }
     else if (div1.find('small').length == 0)
         $('<small>').html(COMMONLANG.PLEASE_WAIT).appendTo(txtDiv);
 };
 
 Page.CloseProcessingMessage = function () {
     $('.loading-show').removeClass('loading-show');
     $('div.loading').remove();
     var obj = $('[old_overflow]');
     obj.css('overflow', obj.attr('old_overflow'));
     obj.removeAttr('old_overflow');
     $('#DIV_ProcessingMessage').remove();
 };
 
 Page.UrlWithActiveTab = function (wnd) {
     wnd = wnd || window;
     var url = wnd.location.href;
     var tab = '';
     try {
         if ($('.tabberlive', wnd.document).length > 0)
             tab = $('.tabberlive', wnd.document).get(0).tabber.getActiveIndex();
         else
             tab = wnd.$('.ui-tabs').tabs("option", "active");
     } catch (e) {
     }
     var sc = $(wnd).scrollTop();
     if (typeof wnd.RefreshScrollSelector != 'undefined')
         sc = $(wnd.RefreshScrollSelector, wnd).offset().top - 100;
     if (typeof wnd.TabIndex != "undefined")
         for (var i = 0; i < wnd.TabIndex; i++)
         {
             var tabEl = wnd.$('.ui-tabs[tab_index=' + i + ']');
             tab = 0;
             if (tabEl.length > 0)
                 tab = tabEl.tabs('option', 'active');
             url = wnd.Page.UrlChangeParam('tab' + (i == 0 ? '' : i + 1), tab, url);
         }
     else if (tab > 0)
         url = wnd.Page.UrlChangeParam('tab', tab, url);
     if (sc > 0 || wnd.Page.GetParameter('scroll') > 0)
         url = wnd.Page.UrlChangeParam('scroll', sc, url);
 
     var bsTabs = [];
     wnd.$('UL.nav-ers-tab LI.active').each(function(){
         bsTabs.push($(this).index());
     });
     wnd.$('.card-toolbar UL.nav A.nav-link.active').each(function(){
         bsTabs.push($(this).closest('LI').index());
     });
 
     if (bsTabs.length > 0)
     {
 //		for(var i=0; i<bsTabs.length; i++)
 //			url = Page.UrlChangeParam('tab' + (i == 0 ? '': i), bsTabs[i], url);
         url = wnd.Page.UrlChangeParam('bs-tabs', bsTabs.join(','), url);
     }
     if (typeof wnd.Ara == 'function')
     {
         var params = wnd.Ara(null, null, true);
         var glue = UseRewriteAct == 1 ? '/' : '&';
         for (var name in params)
             if (wnd.Page.GetParameter(name, null, url, UseRewriteAct == 1) === null)
                 url += glue + name + '=' + params[name];
     }
 
     return url;
 };
 
 /**
  * url string ise verilen linke sayfayı yükler, eğer bir object ise mevcut linkte
  * url nesnesindeki değerleri değiştirerek yükler. Örneğin; url = {id: 2} ise
  * adres satırındaki id değerini 2 yarak tekrar yükler
  * @param {string|object} url
  */
 Page.Load = function (url, baseUrl) {
     if (typeof url == 'object')
     {
         var newUrl = baseUrl || Page.UrlWithActiveTab();
         for(var i in url)
             newUrl = Page.UrlChangeParam(i, url[i], newUrl);
         url = newUrl;
     }
     window.location.href = url;
 };
 
 Page.RefreshUrl = function ()
 {
     var obj = $(this);
     var param = obj.attr('page-param');
     if (!param)
         param = obj.attr('id');
     var newVal = obj.attr('page-param-val');
     if (!newVal)
         newVal = obj.val();
     var params = {scroll: $(window).scrollTop()};
     params[param] = newVal;
     Page.Load(Page.UrlChangeParam(params));
     return false;
 };
 
 Page.UrlChangeParam = function (param, newVal, url) {
     if (typeof url == "undefined")
         url = Page.GetWindowHref();
     if ((UseRewriteAct != 1 || url == CALISMA_URL) && !url.match(/\?/))
         url += '?';
 
     if (typeof param == 'object')
     {
         for(var name in param)
             url = Page.UrlReplaceParam(name, param[name], url);
         return url;
     }
 
     return Page.UrlReplaceParam(param, newVal, url);
 };
 
 Page.UrlReplaceParam = function(param, newVal, url)
 {
     var re = new RegExp("([^a-z0-9])" + param + "=([^&/]+)?", "i");
     if (re.test(url))
         url = url.replace(re, "$1" + (newVal ? param + '=' + newVal : ''));
     else if (UseRewriteAct == 1 && typeof ORIGINAL_URL != 'undefined')
     {
         var flag = true;
         if (url.match(/act\//) && param.match(/^act[0-9]?$/))
         {
             var parts = url.replace(/.*act\//, '').split('/');
             for(var i=0; i<parts.length; i++)
             {
                 var act = 'act' + (i == 0 ? '' : i + 1);
                 if (param == act)
                 {
                     var oncesi = (i > 0 ? parts.slice(0, i) : []).join('/');
                     var current= parts[i].match(/=/) ? '/' + parts[i] : '';
                     current = newVal + current;
                     var sonrasi= parts.slice(i + 1).join('/');
                     url = url.replace(/(.*)act\/(.*)/, '$1act/' + oncesi + '/' + current + '/' + sonrasi);
                     flag = false;
                 }
                 if (parts[i].match(/=/))
                     break;
             }
         }
         if (flag)
             url = url + '/' + param + '=' + newVal;
     }
     else
         url = url + '&' + param + '=' + newVal;
     return url.replace(/scroll=0/g, '')
             .replace(/&&/g, '&')
             .replace(/\/$/, '')
             .replace(/\&$/, '')
             .replace(/([a-z0-9])([\/]+)/g, '$1/');
 };
 
 Page.GetScriptUrl = function(name){
     var arr = 0;
     if (! $.isArray(name))
         arr = 1, name = [name];
     var scripts = $('script[src]');
     var path = Page.GetWindowHref().replace(/[^/]*$/, '');
     if (! path.endsWith('/'))
         path += '/';
     for(var i=0; i<name.length; i++)
     {
         var re = new RegExp('/' + name[i], "i");
         for(var k=0; k<scripts.length; k++)
             if (re.test(scripts.eq(k).attr('src')))
             {
                 name[i] = scripts.eq(k).attr('src');
                 if (! name[i].startsWith('http'))
                     name[i] = path + name[i];
                 break;
             }
     }
     if (arr)
         name = name[0];
     return name;
 };
 
 Page.Ajax = function () {
     this.AutoCloseProcessingMessage = true;
 
     this._callback = function (resp) {
         Page.Ajax.ResponseWaiting = false;
         if (this.AutoCloseProcessingMessage && this.MessageShown)
             Page.CloseProcessingMessage();
         var that = this;
         if (typeof Page.Ajax.SendCallback == "function")
             Page.Ajax.SendCallback(resp, function(){
                 that.CallBackFunction(resp, that.RefreshStyle);
             });
         else
             this.CallBackFunction(resp, this.RefreshStyle);
     };
 
     this.GetUrl = function () {
         // Ajax istekleri için Rewrite aktif olmayacak
         var url = Page.GetWindowHref();
         if (typeof ORIGINAL_URL != "undefined" && ORIGINAL_URL != '')
             url = ORIGINAL_URL;
         var oldRewriteAct = UseRewriteAct;
         UseRewriteAct = 0;
         var url= Page.UrlChangeParam('ajax', '1', url);
         UseRewriteAct = oldRewriteAct;
         return url;
     };
 
     /**
      * @returns {Page.Ajax}
      */
     this.Send = function (ServerFunc, Params, CallBackFunc, Message, AutoCorrect) {
         if (is_set(AutoCorrect))
             this.AutoCorrect = AutoCorrect;
         if (is_set(CallBackFunc) && CallBackFunc != null)
             this.SetCallback(CallBackFunc);
         if (is_set(Message))
             this.Message = Message;
         if (Page.Ajax.ResponseWaiting && false) {
             Page.ShowError(COMMONLANG.PROCESS_IN_PROGRESS);
             return this;
         }
         this.MessageShown = false;
         if (this.Message != null && this.Message != '')
         {
             Page.Loading(this.Message);
             this.MessageShown = true;
         }
         Page.Ajax.ResponseWaiting = true;
         GenerateCp();
         cp.autoCorrectEncoding = this.AutoCorrect;
         cp.call(this.Url, ServerFunc, this, Params);
 
         return this;
     };
 
     /**
      * @returns {Page.Ajax}
      */
     this.SendBool = function (ServerFunc, CustomParams, CallBackFunction, Message, AutoCorrect) {
         var that = this;
         var cb = function (resp) {
             if (that.MessageShown)
                 Page.CloseProcessingMessage();
             if (resp != '1')
                 return Page.ShowError(COMMONLANG.ERROR + ': ' + resp);
             if (typeof CallBackFunction == 'function')
                 CallBackFunction(resp);
         };
         return this.Send(ServerFunc, CustomParams, cb, Message, AutoCorrect);
     };
 
     /**
      * @returns {Page.Ajax}
      */
     this.SendJson = function (ServerFunc, CustomParams, CallBackFunction, Message, AutoCorrect) {
         var that = this;
         var cb = function (resp) {
             if (that.MessageShown)
                 Page.CloseProcessingMessage();
             var sonuc = JSON.TryParse(resp, null);
             if (sonuc === null)
                 return Page.ShowError(COMMONLANG.ERROR + ': ' + resp);
             if (typeof CallBackFunction == 'function')
                 CallBackFunction(sonuc, resp);
         }
         return this.Send(ServerFunc, CustomParams, cb, Message, AutoCorrect);
     };
 
     /**
      * @returns {Page.Ajax}
      */
     this.CorrectEncoding = function (correct) {
         if (is_set(correct))
             this.AutoCorrect = correct;
         return this;
     };
 
     /**
      * @returns {Page.Ajax}
      */
     this.SetMessage = function (msg) {
         this.Message = msg;
         return this;
     };
 
     /**
      * @returns {Page.Ajax}
      */
     this.SetCallback = function (callback) {
         if (typeof callback == "function")
             this.CallBackFunction = callback;
         else if (typeof callback == "number")
             this.RefreshStyle = callback;
         return this;
     };
 
     this.Url = this.GetUrl();
     this.AutoCorrect = true;
     this.Message = Page.SAVING_MSG;
     this.MessageShown = true;
     this.CallBackFunction = Page.Ajax.GuncelleKapat;
     this.RefreshStyle = Page.Ajax.DefaultRefreshStyle;
 };
 
 Page.Ajax.ResponseWaiting = false;
 
 /**
  * @returns {Page.Ajax}
  */
 Page.Ajax.Get = function (url) {
     var ajx = new Page.Ajax();
     if (is_set(url) && url != '')
     {
         var oldRw = UseRewriteAct;
         UseRewriteAct = 0;
         ajx.Url = GetUrl(url, null, 1);
         UseRewriteAct = oldRw;
     }
     return ajx;
 };
 
 /**
  * @param {string} ServerFunc Server Funciton Name
  * @param {object} CustomParams
  * @param {function} CallBackFunction
  * @param {string} Message
  * @param {bool} AutoCorrect yazım hatalarını otomatik düzelt, varsayılını true
  * @returns {Page.Ajax}
  */
 Page.Ajax.Send = function (ServerFunc, CustomParams, CallBackFunction, Message, AutoCorrect) {
     return Page.Ajax.Get().Send(ServerFunc, CustomParams, CallBackFunction, Message, AutoCorrect);
 };
 
 /**
  * IRIT = If Response Is True call CallbackFunction
  * Page.Ajax.Send fonksiyonu ile aynı şekilde çalışır, tek fark CallBackFunction'a sadece işlem
  * sonuc true(1) ise çalıştırır, aksi halde Page.ShowError a gönderir.
  * @param {string} ServerFunc Server Funciton Name
  * @param {object} CustomParams
  * @param {function} CallBackFunction
  * @param {string} Message
  * @param {bool} AutoCorrect
  * @returns {Page.Ajax}
  */
 Page.Ajax.SendBool = function (ServerFunc, CustomParams, CallBackFunction, Message, AutoCorrect) {
     return Page.Ajax.Get().SendBool(ServerFunc, CustomParams, CallBackFunction, Message, AutoCorrect);
 };
 
 /**
  * IRIJ = If Response Is Json call CallbackFunction
  * Page.Ajax.Send fonksiyonu ile aynı şekilde çalışır, tek fark CallBackFunction'a sadece işlem
  * sonuc Json nesnesi ise çalıştırır, aksi halde Page.ShowError a gönderir.
  * @param {string} ServerFunc Server Funciton Name
  * @param {object} CustomParams
  * @param {function} CallBackFunction
  * @param {string} Message
  * @param {bool} AutoCorrect
  * @returns {Page.Ajax}
  */
 Page.Ajax.SendJson = function (ServerFunc, CustomParams, CallBackFunction, Message, AutoCorrect) {
     return Page.Ajax.Get().SendJson(ServerFunc, CustomParams, CallBackFunction, Message, AutoCorrect);
 };
 
 
 /**
  * Verilen parametrelere bağlı olarak json nesnesi olarak veriyi getirir,
  * gelen veri json değilse hata mesajı verir, bu işlem sırasında "yükleniyor" mesajı gösterir
  * @param {string} ServerFunc Server Funciton Name
  * @param {object} CustomParams
  * @param {function} CallBackFunction
  * @returns {Page.Ajax}
  */
 Page.Ajax.Load = function (ServerFunc, CustomParams, CallBackFunction) {
     return Page.Ajax.SendJson(ServerFunc, CustomParams, CallBackFunction, Page.LOADING_MSG);
 };
 
 
 Page.Ajax.DO_NOTHING = 0;
 Page.Ajax.REFRESH = 1;
 Page.Ajax.CLOSE = 2;
 Page.Ajax.REFRESH_AND_CLOSE = 3;
 Page.Ajax.REFRESH_NO_MSG = 4;
 Page.Ajax.REFRESH_WITH_MSG = 5;
 Page.Ajax.REFRESH_AND_MSG = 6;
 
 Page.Ajax.DefaultRefreshStyle = Page.Ajax.REFRESH_AND_CLOSE;
 
 Page.Ajax.GuncelleKapat = function (yanit, style) {
     if (!is_set(style))
         style = Page.Ajax.REFRESH_AND_CLOSE;
     if (style == Page.Ajax.REFRESH_AND_MSG)
         return Page.ShowSuccess(yanit);
     if (yanit == '1')
     {
         if (style == Page.Ajax.DO_NOTHING)
             return;
         if (__unsavedChangesTracker)
             __unsavedChangesTracker.Stop = true;
         if (style == Page.Ajax.REFRESH_NO_MSG)
             return Page.Refresh();
 
         if (window.opener == window || window.opener == null || window.opener.closed)
             Page.ShowSuccess(COMMONLANG.PROCESS_COMPLETED + ".", Page.Refresh);
         else
         {
             switch (style)
             {
                 case Page.Ajax.REFRESH_WITH_MSG:
                 case Page.Ajax.REFRESH:
                     var cb = function () {
                         Page.Reload(true);
                     };
                     if (style == Page.Ajax.REFRESH)
                         cb();
                     else
                         Page.ShowSuccess(COMMONLANG.PROCESS_COMPLETED, cb);
                     return;
                 case Page.Ajax.CLOSE:
                     return window.close();
                 case Page.Ajax.REFRESH_AND_CLOSE:
                     return Page.RefreshAndClose();
             }
         }
     } else
         Page.ShowError(COMMONLANG.ERROR + ': ' + yanit);
 };
 
 /**
  * @param string divId
  * @param function action
  * @param string actionName
  * @param boolean cancellable
  * @returns object
  */
 Page.ShowBSDialog = function(divId, action, actionName, cancellable, sizeName){
     return Page.ShowDialogBS(divId, 0, 0, action, actionName, cancellable, sizeName);
 };
 Page.BSDialog_CANCELLABLE = true;
 Page.BSDialog_CANCELBUTTON= 2;
 Page.ShowDialogBS = function(divId, width, height, action, actionName, cancellable, sizeName)
 {
     if (typeof sizeName == 'undefined')
         sizeName = "";
     if (typeof actionName == 'undefined')
         actionName = COMMONLANG.SAVE;
     if (typeof cancellable == "undefined")
         cancellable = true;
     var cancelBtn = '';
     if (cancellable)
         cancelBtn = '<button type="button" class="btn btn-default cancel" data-dismiss="modal">' + COMMONLANG.CANCEL + '</button>';
     var okButton = '<button type="button" class="btn btn-info save">'+actionName+'</button>';
     if (actionName == '')
         okButton = '';
     if (divId.charAt(0) == '#')
         divId = divId.substr(1);
     var div = $('#' + divId).show();
     var modalId = divId + '_modal';
     var modal = $('#' + modalId);
     var title = div.attr('title');
     if(title == "")
         title = div.attr('data-original-title');
 
     if (modal.length > 0)
         modal.remove();
 
     modal = $([
         '<div id="' + modalId + '" class="modal js-table" role="dialog" aria-hidden="true">',
           '<div class="modal-dialog '+sizeName+'">',
             '<div class="modal-content">',
               '<div class="modal-header">',
                 '<h4 class="modal-title">' + title  + '</h4>',
                 (cancellable ? '<i class="fa fa-times fa-close cursor-pointer" data-dismiss="modal"></i>' : ''),
               '</div>',
               '<div class="modal-body">',
               '</div>',
               '<div class="modal-footer">',
                 cancelBtn,
                 okButton,
               '</div>',
             '</div>',
           '</div>',
         '</div>'
         ].join("\n")).appendTo('body');
 
     div.appendTo(modal.find('.modal-body'));
     modal.find('BUTTON.save').click(function(){
         var sonuc = true;
         if (typeof action == "function")
             sonuc = action();
         if (sonuc)
             modal.modal('hide');
     });
     var settings = {};
     if (!cancellable || cancellable === Page.BSDialog_CANCELBUTTON)
         settings = {backdrop: 'static', keyboard : false};
     $(document).on('show.bs.modal','#'+modalId, function () {
         var fnc = function(){
             $(this).chosen('destroy');
             $(this).parent().find('.chosen-container').remove();
             $(this).show();
             $(this).chosen({width: "95%"});
         };
         div.find('[var_type=date],[date_selector=1]')
             .removeClass('hasDatepicker hasMask');
         Tarih.SetDateSelector(div);
         div.find('SELECT[editable_list=1]').each(fnc);
         div.find('SELECT.buttonset').each(function(){
             var parent = $(this).parent();
             var id = $(this).attr('id') || '';
             parent.find('DIV[id="' + id + '_div"]').remove();
             parent.find('DIV.ui-buttonset').remove();
             Jui.InitInputs(parent);
         });
         PinEvent();
     });
     var modalDiv = modal.modal(settings);
     return modalDiv;
 };
 
 Page.ShowDialog = function (divId, width, height, action, ekDiv)
 {
     if (typeof divId == 'string' && divId.charAt(0) != '#')
         divId = '#' + divId;
     var div = $(divId).show();
     var o = new Object();
     o.width = width;
     o.height = height;
     o.modal = true;
     o.closeText = COMMONLANG.CLOSE;
     o.resize = function(event, ui){
         div.width( div.parent().width() - 30);
     };
     o.buttons = new Object();
     if ($.isArray(action))
     {
         o.buttons = action;
         for (var i = 0; i < o.buttons.length; i++)
         {
             var btn = o.buttons[i];
             if (btn.icon)
                 btn.icons = {primary: btn.icon};
             if (typeof btn.cb == "function")
                 btn.click = btn.cb;
         }
     }
     else
     {
         o.buttons[COMMONLANG.OK] = function () {
             var ret = true;
             if (typeof action == "function")
                 ret = action(div);
             if (ret)
                 $(this).dialog('close');
         };
         o.buttons[COMMONLANG.CANCEL] = function () {
             $(this).dialog("close");
         };
     }
     o.dialogClass = 'fixed-dialog';
     var dlg = div.dialog(o);
     if(typeof dlg.dialogExtend == "function")
         dlg.dialogExtend({ maximizable: true });
     if (is_set(ekDiv) && !div.attr('ekDiv_eklendi'))
     {
         if (typeof ekDiv == 'string' && ekDiv.charAt(0) == '#' && $(ekDiv).length > 0)
             ekDiv = $(ekDiv);
         else
             ekDiv = $('<DIV>').append(ekDiv);
         ekDiv.css({float: 'left', paddingTop: '5px'});
         $('.ui-dialog[aria-describedby="' + divId.replace(/#/g, '') + '"] .ui-dialog-buttonset')
                 .before(ekDiv);
         div.attr('ekDiv_eklendi', '1');
     }
     return div;
 };
 
 Page.CustomMessages = {};
 
 var _AlertLast = null;
 Page._Alert = function (msg, title, imgName, buttons, okCallback)
 {
     msg = msg.toString();
     msg = Page.GetCustomMessage(msg);
     Page.CloseProcessingMessage();
     var div = $('<div></div>')
             .addClass('ers-alert-dialog')
             .html(msg.replace(new RegExp('\n', 'g'), '<br/>'));
    if (imgName)
        div.css({
            'background': 'url(../images/' + imgName + ') no-repeat 5px 5px',
            'padding-left': '60px'
        });        
     var o = new Object();
     o.modal = true;
     o.width = $(window).width() > 500 ? 500 : $(window).width();
     o.closeText = COMMONLANG.CLOSE;
     o.title = title;
     if ($.browser.chrome)
         o.draggable = false;
     if (is_set(buttons) && buttons)
         o.buttons = buttons;
     else
     {
         o.buttons = {};
         o.buttons[COMMONLANG.OK] = function () {
             $(this).dialog("close");
             if (is_set(okCallback))
                 okCallback();
         };
     }
     $('body').addClass('loading-show');
     o.close = function(){
         $('body').removeClass('loading-show');
     };
     return _AlertLast = div.dialog(o);
 };
 Page.CallSwal = function(options, callback)
 {
     if (typeof swal != 'function' || ! Page.UseSwal)
         return false;
     if (typeof swal.fire == 'function')
     {
         options.html = options.text;
         delete options.text;
         options.icon = options.type;
         if (options.type == 'input')
         {
             options.input = 'text';
             options.inputValidator = function(value){
                 if (value == '')
                     return options.inputErrorMessage;
             };
         }
         swal.fire(options).then(callback);
     }
     else if(Page.UseSwalV2)
     {
         options.html = options.text;
         delete options.text;
         swal(options).then(callback);
     }
     else
     {
         options.html = true;
         swal(options, callback);
     }
     return true;
 }
 //old_alert = window.alert;
 //window.alert =
 Page.ShowInfo = function (msg, okCallback)
 {
     msg = Page.GetCustomMessage(msg);
     var result = Page.CallSwal({
         title: COMMONLANG.INFORMATION,
         text: msg,
         type: 'info',
         confirmButtonText: COMMONLANG.OK
         }, okCallback);
     if (! result)
         Page._Alert(msg, COMMONLANG.INFORMATION, "info.png", null, okCallback);
 };
 
 Page.ShowSuccess = function (msg, okCallback)
 {
     msg = Page.GetCustomMessage(msg);
     var result = Page.CallSwal({
         title: COMMONLANG.SUCCESS,
         text: msg,
         type: 'success',
         confirmButtonText: COMMONLANG.OK
         }, okCallback);
     if (! result)
         Page._Alert(msg, COMMONLANG.SUCCESS, "success.png", null, okCallback);
     return true;
 };
 
 Page.ShowWarning = function (msg, okCallback)
 {
     msg = Page.GetCustomMessage(msg);
     var result = Page.CallSwal({
         title: COMMONLANG.WARNING,
         text: msg,
         type: 'warning',
         confirmButtonText: COMMONLANG.OK
         }, okCallback);
     if (! result)
         Page._Alert(msg, COMMONLANG.WARNING, "warning.png", null, okCallback);
     return false;
 };
 
 Page.ShowError = function (msg, okCallback)
 {
     msg = Page.GetCustomMessage(msg);
     var result = Page.CallSwal({
         title: COMMONLANG.ERROR,
         text: msg,
         type: 'error',
         confirmButtonText: COMMONLANG.OK
         }, okCallback);
     if (! result)
         Page._Alert(msg, COMMONLANG.ERROR, "error.png", null, okCallback)
             .parent().find('.ui-dialog-titlebar').addClass('ui-state-error');
     return false;
 };
 
 Page.ShowConfirm = function (msg, okCallback, cancelCallback)
 {
     msg = Page.GetCustomMessage(msg);
     var result = Page.CallSwal({
         title: COMMONLANG.CONFIRMATION,
         text: msg,
         type: 'warning',
         confirmButtonText: COMMONLANG.YES,
         cancelButtonText: COMMONLANG.NO,
         showCancelButton: true
         }, function(isConfirm){
             if (typeof isConfirm == 'object')
                 isConfirm = isConfirm.isConfirmed;
             if (isConfirm && typeof okCallback == 'function')
                 okCallback();
             if (!isConfirm && typeof cancelCallback == 'function')
                 cancelCallback();
         });
 
     var buttons = {};
     buttons[COMMONLANG.YES] = function () {
             $(this).dialog("close");
             if (typeof okCallback == 'function')
                 okCallback();
             else
                 Page.Open(okCallback);
         };
     buttons[COMMONLANG.NO] = function () {
             if (typeof cancelCallback == "function")
                 cancelCallback();
             $(this).dialog("close");
         };
     if (! result)
         Page._Alert(msg, COMMONLANG.CONFIRMATION, "confirm.png", buttons);
 };
 
 Page.ShowPrompt = function (name, dflt, okCallback, errorMessage, okBtnName, notNull)
 {
     if(typeof okBtnName == 'undefined')
         okBtnName = COMMONLANG.OK;
     if(typeof errorMessage == 'undefined')
         errorMessage = COMMONLANG.ENTER_VALID_VALUE;
     if(typeof notNull == 'undefined')
         notNull = true;
 
     var result = Page.CallSwal({
             title: name,
             type: "input",
             showCancelButton: true,
             text: '',
             closeOnConfirm: false,
             animation: "slide-from-top",
             confirmButtonText: okBtnName,
             cancelButtonText: COMMONLANG.CANCEL,
             inputErrorMessage: errorMessage,
             inputValue: dflt
           },
           function(inputValue){
             // swal.fire olan version
             if (typeof inputValue == "object" && typeof inputValue['isConfirmed'] != "undefined")
             {
                 if (! inputValue['isConfirmed'])
                     return false;
                 okCallback(inputValue['value']);
                 return true;
             }
 
             if (inputValue === false) return false;
             if (inputValue === "" && notNull) {
               swal.showInputError(errorMessage);
               return false;
             }
             okCallback(inputValue);
             swal.close();
           });
     if (! result)
     {
         $('#ShowPromptDiv').remove();
         div = $('<div>').attr('id', 'ShowPromptDiv').attr('title', name).appendTo('body');
         $('<input>').appendTo(div);
 
         var inp = div.find('INPUT').val(dflt || '');
         Page.ShowDialog('ShowPromptDiv', 300, 150, function(){
             return okCallback(inp.val()); });
         setTimeout("$('#ShowPromptDiv').find('INPUT:first').focus();", 100);
     }
 };
 
 /**
  * Verilen div elementini modal form olarak gösterir.
  * @param {string} divId
  * @param {int} width
  * @param {int} height
  * @param {string} okTitle (Seçimlilik)
  */
 Page.ShowInfoDiv = function (divId, width, height, okTitle, okCallBack, showOkButton)
 {
     if (divId.charAt(0) != '#')
         divId = '#' + divId;
     if (! okTitle)
         okTitle = COMMONLANG.OK;
     if (typeof showOkButton == "undefined")
         showOkButton = true;
     var div = $(divId);
     var title = div.attr('title');
     var o = {
             modal: true,
             width: width,
             height: height,
             closeText: COMMONLANG.CLOSE,
             title: title,
             draggable: false,
             close: function(){
                 $('body').css('overflow', oldFlw).css('padding-right', '');
                 div.attr('title', title);
             },
             buttons: {}
         };
     var oldFlw = $('body').css('overflow');
     if (showOkButton)
         o.buttons[okTitle] = function () {
             var sonuc = 1;
             if(typeof okCallBack == "function")
                 sonuc = okCallBack();
             if(sonuc == 1)
                 $(this).dialog("close");
         };
     if ($('body').height() > $(window).height())
         $('body').css('padding-right', '18px');
     $('body').css('overflow', 'hidden');
     return _AlertLast = div.dialog(o);
 };
 
 Page.FileDownloadMessage = function (msg) {
     if (!is_set(msg))
         msg = COMMONLANG.FILE_BEING_GENERATED + '...';
     Page.Loading(msg);
     $(window).unbind('blur')
             .bind('blur', function () {
                 Page.CloseProcessingMessage();
                 $(window).unbind('blur');
             });
 };
 
 String.CleanMsWordChars = function (text, htmlEntities) {
     var swapCodes = new Array(8211, 8212, 8216, 8217, 8220, 8221, 8226, 8230); // dec codes from char at
     var swapStrings = new Array("--", "--", "'", "'", '"', '"', "*", "...");
     if (typeof htmlEntities != "undefined" && htmlEntities == true)
     {
         swapStrings[2] = "&#39;";
         swapStrings[3] = "&#39;";
         swapStrings[4] = "&quot;";
         swapStrings[5] = "&quot;";
     }
     for (var i = 0; i < swapCodes.length; i++)
     {
         var swapper = new RegExp("\\u" + swapCodes[i].toString(16), "g"); // hex codes
         text = text.replace(swapper, swapStrings[i]);
     }
     var entities = [
         /[\u20A0-\u219F]/gim,	// Currency symbols
         /[\u2200-\u22FF]/gim,	// Math operators
         /[\u2000-\u20FF]/gim,  // Weird punctuation
         /[\uD000-\uDFFF]/gim,  // Weird Ms Word formula characters
         /[\u0000-\u001F\u0090-\u009F]/gim	// String literal control characters
     ];
     for (var i = 0; i < entities.length; i++)
     {
         var re = new RegExp(entities[i]);
         text = text.replace(re, function (c) {
             if (i == entities.length - 1)
                 return '';
             return '&#' + c.charCodeAt(0) + ';';
         });
     }
     return $.trim(text);
 };
 
 String.DecodeEntities = (function () {
     // this prevents any overhead from creating the object each time
     var element = document.createElement('div');
     function decodeHTMLEntities(str, returnHtml) {
         if (typeof returnHtml == "undefined")
             returnHtml = false;
         if (!str)
             return str;
         if ($.isArray(str))
             for (var i = 0; i < str.length; i++)
                 str[i] = String.DecodeEntities(str[i]);
         else if (typeof str === "object")
             for (var i in str)
                 str[i] = String.DecodeEntities(str[i]);
         else if (typeof str === 'string') {
             // strip script/html tags
             str = str.replace(/&amp;/gmi, '&');
             str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
             if (! returnHtml)
             {
                 element.innerHTML = str;
                 str = element.textContent;
             }
             element.textContent = '';
         }
         return str;
     }
     return decodeHTMLEntities;
 })();
 
 String.ReverseQuoteEntities = function (str) {
     if (typeof str === 'object' && str !== null)
     {
         for (var i in str)
             str[i] = String.ReverseQuoteEntities(str[i]);
         return str;
     }
     if (str && str != '')
     {
         str = str.replace(/\&\#39;/ig, "'");
         str = str.replace(/\&quot;/ig, '"');
         return str;
     } else
         return '';
 };
 
 /**
  * @param {string} tblSel
  * @param {string} templateOrCounts
  * @param {array} data
  * @param {function} callback
  * @param {int} rowIndex
  * @returns {TR}
  */
 Table.AddNewRow = function (tblSel, templateOrCounts, data, callback, rowIndex)
 {
     var templateSel = null;
     var cellCount = null;
     if (typeof templateOrCounts == "number")
         cellCount = templateOrCounts;
     else
         templateSel = templateOrCounts;
 
     var tbl = $(tblSel).find('TBODY').get(0);
     if (!is_set(rowIndex) || rowIndex === null)
         rowIndex = tbl.rows.length;
     var row = tbl.insertRow(rowIndex);
     if (templateSel)
     {
         var temp = $(templateSel);
         // İçerik
         $(row).html(temp.html());
         // Attributes
         var attrIgnoreList = ['style', 'class', 'id', 'new_class'];
         for (var i = 0; i < temp.get(0).attributes.length; i++)
         {
             var attr = temp.get(0).attributes[i];
             if ($.inArray(attr.name, attrIgnoreList) >= 0)
                 continue;
             var val = attr.value;
             var match = val.match(/\$(.*)/i);
             if (match)
             {
                 // Table.UpdateRow kısmında güncellenecek
                 // o yüzden döngüde bir sonraki adıma atlıyoruz
                 $(row).attr('_' + attr.name, val);
                 continue;
             }
             $(row).attr(attr.name, val);
         }
         var cls = temp.get(0).getAttribute('new_class');
         if (cls)
             $(row).addClass(cls);
     } else
         for (var i = 0; i < cellCount; i++)
             row.insertCell(i);
     var rows = $(tbl).find("TR");
     for(var i=0; i<rows.length; i++)
         rows.eq(i).find('TD.SiraNo').html( i + 1);
     $(row).find(EmptyValSel('[id!=]')).removeAttr('id');
     $(row).find('.hasDatepicker').removeClass('hasDatepicker');
     Jui.InitInputs(row);
     // Veri
     if (is_set(data) && data)
         Table.UpdateRow(row, data);
     $(row).click(function(){
         var tbl = $(this).parents('TABLE').first();
         tbl.find('TR.selected-row')
             .removeClass('selected-row')
             .find('TD').css({backgroundColor: ''})
             .first()
             .css({border: ''});
         var border = '3px solid green';
         $(this).addClass('selected-row')
             .find('TD').css({backgroundColor: 'lightyellow'})
             .first()
             .css({borderLeft: border});
     });
     if (is_set(callback) && typeof callback == "function")
         callback(row);
     return row;
 };
 
 Table.DeleteSelectedRow = function (tbl)
 {
     var sel = $(tbl).first().find('TR.selected-row');
     if (sel.length == 0 || !confirm(COMMONLANG.DELETE_CONFIRMATION))
         return;
     $(tbl).get(0).deleteRow(sel.get(0).rowIndex);
     var rows = $(tbl).find("TBODY TR");
     for(var i=0; i<rows.length; i++)
         rows.eq(i).find('TD.SiraNo').html( i + 1);
 };
 
 Table.DeleteAllRows = function (tbl)
 {
     var rows = $(tbl).find('TBODY TR');
     for (var i = rows.length - 1; i >= 0; i--)
         $(tbl).get(0).deleteRow(rows.eq(i).rowIndex);
 };
 
 Table.UpdateRow = function (row, data)
 {
     row = $(row).get(0);
     for (var i = 0; i < row.attributes.length; i++)
     {
         var attr = row.attributes[i];
         if (attr.name.charAt(0) != '_')
             continue;
         var val = attr.value;
         var match = val.match(/\$(.*)/i);
         if (match && typeof data[match[1]] != "undefined")
             val = data[match[1]];
         else if (match && !data)
             val = '';
         $(row).attr(attr.name.substring(1), val);
     }
 
     if (typeof data.length == "number")
     {
         for (var i = 0; i < data.length; i++)
             if (row.cells[i])
                 row.cells[i].innerHTML = data[i];
     } else
         for (var i in data)
         {
             var el = $(row).find('.' + i);
             if(el.length <= 0)
                 el = $(row).find('[field_name="'+i+'"]');
             if(el.length <= 0)
                 el = $(row).find('[field="'+i+'"]');
             if (el.length > 0)
             {
                 var format = el.attr('format');
                 if (format)
                 {
                     var matches = format.match(/(.*)\.(.*)/);
                     if (matches)
                         format = window[matches[1]][matches[2]];
                     else
                         format = window[format];
                     if (typeof format == "function")
                         data[i] = format(data[i]);
                 }
 
                 if (el.prop('tagName') == 'SELECT')
                 {
                     if (el.find('option[value="'+data[i]+'"]').length <=0)
                         el.each(function(){
                             var opt = new Option();
                             opt.value = data[i];
                             opt.text = data[i];
 
                             var lastOpt = this.options[this.options.length - 1];
                             this.options[this.options.length - 1] = opt;
                             this.options[this.options.length] = lastOpt;
                         });
                     el.val(data[i]);
                     el.change();
                 }
                 else{
                     el.html(data[i]);
                     Form.SetValue(el, data[i]);
                 }
             }
         }
 };
 
 Table.GetSelectedIds = function (tblSel, idAttr)
 {
     if (!is_set(idAttr))
         idAttr = 'row_id';
     var ids = [];
     $(tblSel).find('TBODY TR').each(function () {
         var cb = $(this).find('INPUT[type="checkbox"]').get(0);
         if (!cb.checked)
             return;
         ids.push($(this).attr(idAttr));
     });
     return ids;
 };
 
 Table.DelParentRow = function (obj)
 {
     $(obj).parents('TR').first().remove();
 };
 
 /**
  *
  * @param {array} items item dizisi,
  *			her item nesnesi
  *			{text: '', cb: func|string, icon: '', target = '', sub: array}
  *			şeklinde bir nesnedir
  * @param isSub
  * @returns {JQuery}
  */
 Jui.ul = function (items, isSub)
 {
     var ul = $('<ul></ul>').appendTo('body');
     if (!isSub)
         ul.css('z-index', '10001');
     for (var i = 0; i < items.length; i++)
     {
         var item = items[i];
         var li = $('<li><a></a></li>');
         var a = li.find('a');
         if (item.icon && item.icon.substr(0,2) == 'ui')
             $('<span class="ui-icon">').addClass(item.icon)
                 .css('float', 'left').appendTo(a);
         if (item.icon && item.icon.substr(0,2) == 'fa')
             $('<i class="fa">').addClass(item.icon).appendTo(a);
         if (item.text)
             $('<span>' + item.text + '</span>').appendTo(a);
         if (item.sub && item.sub.length > 0)
             li.append(Jui.ul(item.sub, true));
         if (typeof item.enabled != "undefined" &&
                 !item.enabled)
             li.addClass('ui-state-disabled');
         if (typeof item.separator && item.separator)
             li.css('border-' + item.separator + '-style', 'solid')
                     .css('border-' + item.separator + '-width', '1px');
         if (typeof item.cb == 'function')
         {
             a.attr('href', 'javascript:void(0)');
             a.click(item.cb);
         } else if (item.cb)
         {
             a.attr('href', item.cb);
             if (item.target)
                 a.attr('target', item.target);
         }
         if (item.attr)
             for (var name in item.attr)
                 a.attr(name, item.attr[name]);
         li.appendTo(ul);
     }
     return ul;
 };
 
 Jui.CreateButton = function(props){
     // Özellikleri kontrol et
     var btn = {text: '', cb: null, icon: '', tool: false, enabled: 1, visible: 1, separator: null};
     for (var prop in props)
         btn[prop] = props[prop];
     if (btn.enabled == '0' || btn.enabled == '' || btn.enabled == false)
         btn.enabled = 0;
     if (btn.visible == '0' || btn.visible == '' || btn.visible == false)
         btn.visible = 0;
     if (!btn.enabled)
         btn.cb = null;
     if (btn.cb && typeof window[btn.cb] == 'function')
         btn.cb = window[btn.cb];
     // BUTTON etiketini oluştur ve özellikleri yansıt
     var button = $('<button class="jui-button"></button>');
     var options = {icons: {}};
     if (btn.icon)
         options.icons = {primary: btn.icon};
     button.attr('default_button', "1");
     button.attr('icon', btn.icon);
     if (btn.text)
         button.html(btn.text);
     if (!btn.enabled)
         options.disabled = true;
     if (btn.tool)
         button.attr('toolbar', 1);
     if (btn.attr)
         button.attr(btn.attr);
     if (btn.cb)
         button.click(btn.cb);
     else
         button.click(function (e) {
             e.stopPropagation();
         });
     return button;
 };
 
 /**
  *
  * @param {string} parentSelector
  * @param {array|object} buttons Buton veya dizisi,
  *			her buton nesnesi
  *			{text: '', cb: func, icon: '', tool: false, enabled: 1, visible: 1}
  *			şeklinde bir nesnedir
  * @returns {jQuery}
  */
 Jui.BUTTON_STYLE_NORMAL			= 1;
 Jui.BUTTON_STYLE_BUTTONSET		= 2;
 Jui.BUTTON_STYLE_DROPDOWN		= 3;
 Jui.BUTTON_STYLE_DROPDOWN_SPLIT = 4;
 Jui.button = function (parentSelector, buttons, style)
 {
     if (!$.isArray(buttons))
         buttons = [buttons];
     if (typeof style == "undefined")
         style = Jui.BUTTON_STYLE_BUTTONSET;
     buttons = Array.Remove(buttons, function(obj) {
         if (typeof obj.visible == "undefined")
             return 0;
         return ! obj.visible;
     });
     if (buttons.length == 0)
         return;
     var p = $(parentSelector);
     if (p.hasClass('hasJuiButtons'))
         return p;
     if (p.length > 1)
     {
         for (var i = 0; i < p.length; i++)
             Jui.button(p[i], buttons, style);
         return p;
     }
     p.addClass('hasJuiButtons');
     var button = null;
     if (style == Jui.BUTTON_STYLE_NORMAL || style == Jui.BUTTON_STYLE_BUTTONSET)
     {
         var div = $('<div style="text-align: right; display: inline"></div>').appendTo(p);
         for(var i=0; i<buttons.length; i++)
         {
             button = Jui.CreateButton(buttons[i]);
             button.appendTo(div);
         }
         return Jui.InitButtons(div, style == Jui.BUTTON_STYLE_BUTTONSET);
     }
 
     if (style == Jui.BUTTON_STYLE_DROPDOWN || style == Jui.BUTTON_STYLE_DROPDOWN_SPLIT)
     {
         var div = $('<div style="text-align: right; display: inline"></div>').appendTo(p);
         // Menüyü açacak olan ana düğme ve gerekiyorsa split düğme üretiliyor
         var button = Jui.CreateButton(buttons[0]);
         var subButton = button; // Menü için click yapılacak button
         button.appendTo(div);
         if (style == Jui.BUTTON_STYLE_DROPDOWN_SPLIT)
         {
             subButton = Jui.CreateButton({text : buttons[1].text, tool : 1});
             subButton.appendTo(div);
         }
         else
             buttons[0].cb = null; // Bu düğmenin bir callback'i olmaması gerekiyor
         subButton.attr('icon', 'ui-icon-triangle-1-s');
         subButton.attr('icon_pos', 'right');
         Jui.InitButtons(div, 1);
 
         // Birinci düğmeyi diziden çıkar ve diziyi menü yap
         buttons.splice(0, 1);
         var ul = Jui.ul(buttons).css('position', 'absolute')
                 .css('display', 'inline-block')
                 .css('white-space', 'nowrap')
                 .hide().menu();
         if (USE_BS_UI || USE_BS_UI_4)
             ul.each(function(){
                 var u = $(this);
                 if (u.find('a[aria-haspopup]').length > 0)
                     return;
                 u.addClass('dropdown-menu')
                 .removeClass('ui-menu ui-widget ui-widget-content ui-corner-all ui-menu-icons')
                 .find('LI').removeClass('ui-menu-item')
                 .find('A').each(function(){
                     // Yeni ikonu ayarla
                     $(this).addClass('dropdown-item');
                     var icon = $(this).find('SPAN:eq(0)');
                     icon.css({float: 'none'});
                     if (! icon.attr('class'))
                         return;
                     var classes = icon.attr('class').split(/\s+/);
                     var newIcon = '';
                     for(var i=0; i<classes.length; i++)
                         if (classes[i] != 'ui-icon'){
                             newIcon = BSui.IconMap(classes[i]);
                             break;
                         }
                     icon.attr('class', 'fa fa-' + newIcon);
                     // Metni ayarla
                     var sp = $(this).find('SPAN:eq(1)');
                     var text = sp.html();
                     sp.remove();
                     $(this).append(" "+text);
                 });
             });
         ul.css('font-size', subButton.css('font-size'));
         subButton.click(function () {
             CurrentContainer = $(this).parent();
             return Jui.ShowMenu(ul, this);
         });
         var width = button.width();
         if (subButton != button)
             width += subButton.width();
         ul.css('minWidth', width);
         ul.css('text-align', 'left');
         p.eq(0).ul = ul;
         return p;
     }
 
     return p;
 };
 
 Jui.buttonFromDiv = function(parentSelector, style){
     var buttons = $(parentSelector).find('BUTTON');
     var objects = [];
     for(var i=0; i<buttons.length; i++)
     {
         var button = buttons.eq(i);
         var btn = {text: '', cb: null, icon: '', tool: false, enabled: 1, visible: 1, separator: null};
         button.find('img,.fa').remove();
         btn.text = button.html();
         btn.cb = button.attr('onclick');
         if (btn.cb)
             btn.cb = btn.cb.replace(/(\(.*\)[; ]*)/, '');
         var events = button.data('events');
         if (typeof events != "undefined" &&
             typeof events.click != "undefined")
         {
             var last = events.click.length - 1;
             btn.cb = events.click[last].handler;
         }
         btn.icon = button.attr('icon');
         btn.enabled = ! button.prop('disabled');
         objects.push(btn);
     }
     buttons.remove();
 
     return Jui.button(parentSelector, objects, style);
 };
 
 Jui.ShowMenu = function (menu, item, toLeft) {
     if (Jui.CloseCurrentMenu(menu))
         return false;
     Jui.CloseCurrentMenu();
     var to = toLeft ? 'left' : 'right';
     CurrentMenu = menu.show().position({
         my: to + " top",
         at: to + " bottom",
         of: item
     });
     $(document).one("click", function () {
         Jui.CloseCurrentMenu();
     });
     return false;
 };
 
 Jui.CloseCurrentMenu = function (menu)
 {
     if (!is_set(menu))
         menu = null;
     if (typeof CurrentMenu != 'undefined' && CurrentMenu
             && (!menu || CurrentMenu == menu))
     {
         CurrentMenu.hide();
         CurrentMenu = null;
         return true;
     }
     return false;
 };
 
 Jui.tabs = function (selector, tabIndex)
 {
     if (typeof window.TabIndex == "undefined")
         window.TabIndex = 0;
     if (typeof tabIndex != "undefined")
         window.TabIndex = tabIndex;
     $(selector).each(function () {
         var tabPane = $(this);
         if (tabPane.hasClass('hasJuiTabs'))
             return;
         tabPane.attr('tab_index', window.TabIndex);
         tabPane.addClass('hasJuiTabs');
         var tabs = tabPane.children();
         var items = [];
         var prefix = '';
         if ($('BASE').length > 0 && $('BASE').attr('href'))
             prefix = Page.GetWindowHref();
         var activeTab = 0;
         var ids = [];
         for (var i = 0; i < tabs.length; i++)
         {
             var tab = $(tabs.get(i));
             var id = tab.attr('id');
             if (!id)
             {
                 id = 'tab' + i;
                 tab.attr('id', id);
             }
             ids.push(id);
             if (tab.attr('active-tab'))
                 activeTab = i;
             var opt = {text: tab.attr('title'), cb: prefix + '#' + id};
             tab.attr('tab_title', tab.attr('title'));
             tab.removeAttr('title');
             if (tab.attr('icon'))
                 opt.icon = tab.attr('icon');
             items[items.length] = opt;
         }
         var ul = Jui.ul(items);
         ul.insertBefore(tabs.get(0));
         var tabParamName = 'tab';
         var tabIndex = window.TabIndex;
         if (tabIndex > 0)
             tabParamName += (window.TabIndex + 1);
         var urlParam = Page.GetParameter(tabParamName);
         if (urlParam)
         {
             var did = $.inArray(urlParam, ids);
             if (did >= 0)
                 activeTab = did;
             else
                 activeTab = parseInt(urlParam);
         }
         tabPane.tabs({
             active: activeTab,
             activate: function (event, ui) {
                 if (typeof ui.newTab.context != "undefined")
                     ui.newTab.context.blur();
                 else
                     ui.newTab.blur();
                 // TinyMCE için resize event trigger ediliyor
                 var resizeEvent = window.document.createEvent('UIEvents');
                 resizeEvent.initUIEvent('resize', true, false, window, 0);
                 window.dispatchEvent(resizeEvent);
             },
             beforeActivate: function (event, ui) {
                 if (!Tabs.EnableBeforeActivate)
                     return;
                 var url = ui.newPanel.attr('url');
                 if (url && url.match(/^https?:\/\//i))
                     Page.Load(url);
                 else if (url)
                 {
                     var location = Page.GetWindowHref();
                     if (url.match(/customTab=/))
                     {
                         location = Page.GetCurrentUrl();
                         for (var i = 0; i < 4; i++)
                         {
                             var n = i == 0 ? 'tab' : 'tab' + i;
                             if (Page.GetParameter(n))
                                 location += "&" + n + "=" + Page.GetParameter(n);
                         }
                     } else
                         location = Page.GetUrlWithParameters(['act', 'tab', 'mode']);
                     var params = url.split('&');
                     for (var i = 0; i < params.length; i++)
                     {
                         var parts = params[i].split('=');
                         location = Page.UrlChangeParam(parts[0], parts[1], location);
                     }
                     // Üstte bir tab'a tıklanmışsa, alt tab'a ait parametreler silinmeli
                     var index = 1;
                     var matches = tabParamName.match(/([0-9]+$)/);
                     if (matches)
                         index = matches[1];
                     for (var i = index + 1; i <= 4; i++)
                         location = Page.UrlChangeParam('tab' + (i <= 1 ? '' : i), '', location);
                     location = Page.UrlChangeParam(tabParamName, ui.newTab.index(), location);
                     if (! location.match(/__pg_id__/) && Page.GetParameter('__pg_id__'))
                     {
                         var last = location.charAt(location.length - 1);
                         if (last != '&')
                             location += '&';
                         location += '__pg_id__=' + Page.GetParameter('__pg_id__');
                     }
                     Page.Load(location);
                     return false;
                 }
                 else
                 {
                     var oTable = $('div.dataTables_scrollBody>table.dataTable', ui.newPanel);
                     if (oTable.length > 0)
                     {
                         oTable = oTable.dataTable();
                         oTable.fnAdjustColumnSizing();
                     }
                 }
             }
         }).show();
         tabPane.prop('TabParam', tabParamName);
         window.TabIndex++;
     }); // each
 };
 
 Jui.float = function (selector, options)
 {
     if (typeof DECIMAL_SEPARATOR == "undefined")
         DECIMAL_SEPARATOR = '.';
     if (typeof THOUSAND_SEPARATOR == "undefined")
         THOUSAND_SEPARATOR = ',';
     options = options || {};
     // thousand
     if (typeof options.aSep == 'undefined')
         options.aSep = options.aSep || THOUSAND_SEPARATOR;
     // Decimal
     options.aDec = options.aDec || DECIMAL_SEPARATOR;
     if (!is_set(options.mDec))
         options.mDec = 2;
     // Sign
     if (!is_set(options.aSign))
         options.aSign = '';
     options.pSign = options.pSign || 's';
     if (!is_set(options.vMax))
         options.vMax = 1e20;
     if (!is_set(options.vMin))
         options.vMin = -1e20;
     if($(selector).hasClass('autoNumeric') && $(selector).data('autoNumeric'))
         return $(selector);
     return $(selector).css('text-align', 'right')
             .autoNumeric('destroy')
             .autoNumeric(options)
             .addClass('autoNumeric');
 };
 
 Jui.double = function (selector, options)
 {
     options = options || {};
     if (!is_set(options.mDec))
         options.mDec = 4;
     return Jui.float(selector, options);
 };
 
 Jui.integer = function (selector, options)
 {
     options = options || {};
     options.mDec = 0;
     return Jui.float(selector, options);
 };
 
 Jui.year = function (selector, options)
 {
     options = options || {};
     options.vMax = 2500;
     options.aSep = '';
     $(selector).css('width', '5em');
     return Jui.integer(selector, options);
 };
 
 Jui.money = function (selector, options)
 {
     options = options || {};
     if (!is_set(options.mDec))
         options.mDec = 2;
     options.aSign = options.aSign || ' TL';
     return Jui.float(selector, options);
 };
 
 Jui.email = function (selector, options)
 {
     try {
         $(selector).inputmask('email').addClass('hasInputMask');
     } catch(e){}
 };
 
 Jui.emailExt = function (selector, options)
 {
     $(selector).each(function(){
         var ext = $(this).attr('email_ext').replace(/([a-z])/ig, '\\$1');
         $(this).addClass('hasInputMask').inputmask({
             mask: "*{1,64}[.*{1,64}][.*{1,64}][.*{1,63}]" + ext,
             greedy: !1,
             definitions: {
                 "*": {
                     validator: "[0-9A-Za-z!#$%&'*+/=?^_`{|}~-]",
                     cardinality: 1,
                     casing: "lower"
                 },
                 "-": {
                     validator: "[0-9A-Za-z-]",
                     cardinality: 1,
                     casing: "lower"
                 }
             }
         });
     });
 };
 
 Jui.percentage = function (selector, options)
 {
     options = options || {};
     if (!is_set(options.mDec))
         options.mDec = 0;
     options.aSign = options.aSign || ' %';
     options.vMin = 0;
     options.vMax = 100;
     return Jui.float(selector, options);
 };
 var __autoCompleteListed = {};
 if ($.widget)
     $.widget("custom.catautocomplete", $.ui.autocomplete, {
         _create: function() {
             this._super();
             this.widget().menu( "option", "items", "> :not(.ui-autocomplete-category)" );
         },
         _renderMenu: function( ul, items ) {
             var that = this;
             $.each( items, function( index, item ) {
                 var li;
                 if (! item || typeof item == 'undefined')
                     return;
                 var cb = $(that.element).attr('auto_complete_render_item');
                 if (cb && typeof window[cb] == "function")
                 {
                     $('<li>' + window[cb](item) + '</li>')
                         .appendTo(ul)
                         .data('item.autocomplete', item)
                         .data('ui-autocomplete-item', item);
                     return;
                 }
                 if (item.value == '')
                 {
                     ul.append( "<li class='ui-autocomplete-category' style='font-weight: bold;'>" + item.label + "</li>" );
                     return;
                 }
                 li = that._renderItemData( ul, item );
             });
         }
     });
 
 Jui.InitAutoComplete = function(selector)
 {
     $(selector).find('[auto_complete="1"]').each(function(){
         var minLength = 0, autoCompleteOnFocus = 1, autoCompleteOnClick = 0;
         if ($(this).attr('min_length'))
             minLength = parseInt($(this).attr('min_length'));
         if ($(this).attr('auto_complete_onfocus'))
             autoCompleteOnFocus = parseInt($(this).attr('auto_complete_onfocus'));
         if ($(this).attr('auto_complete_onclick'))
             autoCompleteOnClick = parseInt($(this).attr('auto_complete_onclick'));
         $(this).catautocomplete({
             source: function(request, response){
                 var data = { ad : request.term.trim() };
                 var obj = $(this.element);
                 var method = obj.attr('method');
                 var act = '';
                 var parts = method.split(':');
                 if (parts.length > 1)
                 {
                     act = parts[0];
                     method = parts[1];
                 }
                 var params = obj.attr('method_params');
                 if (params)
                     $.extend(data, JSON.parse(params));
                 data.method = method;
                 var key = JSON.stringify(data);
                 if (__autoCompleteListed[key])
                 {
                     // Sadece enter tuşuna basıldığında, liste tekrar geliyor
                     // sadece aynı kayıt gösterilip kapatılıyor.
                     // Bunu engellemeye çalışıyoruz
                     var found = __autoCompleteListed[key][0];
                     if (found && __autoCompleteListed[key].length > 1 || found.toUpperCase() != this.element.value().toUpperCase())
                         response(__autoCompleteListed[key]);
                 }
                 else
                 {
                     var cb = function(respText){
                         var resp = JSON.TryParse(respText, null);
                         if (resp == null)
                         {
                             response([]);
                             console.log("Autocomplete çalışmadı: " + respText);
                         }
                         else
                         {
                             var resp = resp.map(function(val){
                                 return String.ReverseQuoteEntities(val);
                             });
                             __autoCompleteListed[key] = resp;
                             if ($.isArray(resp))
                                 for(var i=0; i<resp.length; i++)
                                     resp[i] = String.ReverseQuoteEntities(resp[i]);
                             response(resp);
                         }
                     };
                     Page.Ajax.Get(act).Send(method, data, cb, null);
                 }
             },
             minLength : minLength,
             delay: 200,
             open: function(event, ui) {
                 var width = 'auto';
                 if ($(this).attr('auto_complete_width'))
                     width = $(this).width() + "px";
                 $(this).catautocomplete("widget").css({
                     "minWidth": ($(this).width() + "px"),
                     "width": width
                 });
             },
             change : function(event, ui){
                 if (! ui.item && $(this).attr('acl_next'))
                 {
                     var selector = $(this).attr('acl_next');
                     var td = $(this).closest('.form-horizontal,.data_row,TR').first()
                         .find(selector);
                     if (td.find('INPUT').length > 0)
                         td.find('INPUT').val('');
                     else
                         td.html('');
                 }
                 if ($(this).attr('auto_complete_onchange'))
                 {
                     var m = $(this).attr('auto_complete_onchange');
                     var that = this;
                     setTimeout(function(){
                         window[ m ](that);
                     }, 0);
                 }
             },
             select: function(event, ui){
                 var obj = ui.item;
                 if ($(this).attr('acl_next') && typeof obj.label != "undefined")
                 {
                     var selector = $(this).attr('acl_next');
                     var td = $(this).closest('.form-horizontal,.data_row,TR')
                         .first().find(selector);
                     if (td.find('INPUT').length > 0)
                         td.find('INPUT').val(obj.label);
                     else
                         td.html(obj.label);
                 }
                 if ($(this).attr('auto_complete_onselect'))
                 {
                     var m = $(this).attr('auto_complete_onselect');
                     var that = this;
                     setTimeout(function(){
                         window[ m ](that, obj.value, obj.label);
                     }, 0);
                 }
             }
         })
         .keyup(function(e){
             if(e.which === 13)
                 $(".ui-autocomplete").hide();
         });
         if (autoCompleteOnFocus)
             $(this).focus(function(){
                 $(this).catautocomplete('search', $(this).val());
             });
         else if (autoCompleteOnClick)
             $(this).click(function(){
                 var val = $(this).val();
                 var emptySearchStr = $(this).attr('auto_complete_emptysearch');
                 if (val == '' && emptySearchStr)
                     $(this).catautocomplete('search', emptySearchStr);
             });
     });
 };
 
 Jui.InitInputs = function (selector, autoStylize)
 {
     if (typeof autoStylize == "undefined")
         autoStylize = true;
     selector = selector || 'body';
     // Tüm inputları ui e göre düzenle
     if (STYLIZE_INPUTS && autoStylize)
     {
         $(selector).find('input:text,input:password').not('.normal-input').addClass('ui-widget').addClass('ui-widget-content').addClass('ui-corner-all');
         $(selector).find('select:not(.normal-input)').addClass('ui-widget').addClass('ui-widget-content').addClass('ui-corner-left');
     }
     Jui.InitCheckboxes(selector);
     $(selector).find('[var_type]').each(function () {
         var fnc = $(this).attr('var_type');
         var o = {
             mDec: $(this).attr('digit'),
             aSign: $(this).attr('unit'),
             vMin: $(this).attr('vmin'),
             vMax: $(this).attr('vmax'),
             pSign: $(this).attr('unit_dir')};
         if (fnc == 'int' || fnc == 'integer')
             Jui.integer(this, o);
         else if (fnc == 'year')
             Jui.year(this, o);
         else if (fnc == 'float')
             Jui.float(this, o);
         else if (fnc == 'double')
             Jui.double(this, o);
         else if (fnc == 'money')
             Jui.money(this, o);
         else if (fnc == 'email')
             Jui.email(this, o);
         else if (fnc == 'email_ext')
             Jui.emailExt(this, o);
         else if (fnc == 'percentage')
             Jui.percentage(this, o);
     });
     Tarih.SetDateSelector(selector);
     RichEdit.Init(selector);
 
     $(selector).find('input[auto_list]').each(function () {
         var list = $(this).attr('auto_list').split('#|#');
         $(this).autocomplete({
             source: list, minLength: 0, delay: 0
         }).focus(function () {
             var inp = $(this);
             setTimeout(function () {
                 inp.select();
             }, 50);
             $(this).autocomplete("search", "");
         });
     });
     $(selector).find('SELECT[dependency]').each(function () {
         var obj = $(this);
         var dep = obj.attr('dependency');
         var matches = dep.match(/^(.*):(.*)$/i);
         if (matches)
             dep = obj.parents(matches[1]).first().find(matches[2]);
         else
             dep = '#' + dep;
         var otherId = 'Backup_' + obj.attr('ListType');
         var backupSel = $('#' + otherId);
         var val = obj.val();
         if (backupSel.length == 0)
             backupSel = $('<SELECT></SELECT>')
                     .attr('id', otherId)
                     .appendTo('body')
                     .html(obj.html())
                     .hide();
         $(dep).change(function () {
             obj.val('');
             var items = $(this).find('OPTION:selected').attr('sub_items');
             if (!items)
                 items = [];
             else
                 items = JSON.parse(items);
             obj.find('OPTION[value!=""]').remove();
             for (var i = 0; i < items.length; i++)
             {
                 var id = items[i];
                 if (typeof items[i] == "object")
                     id = items[i].Id;
                 var options = backupSel.find('OPTION[value="' + id + '"]');
                 for (var k = 0; k < options.length; k++)
                 {
                     var opt = options.get(k).outerHTML;
                     $(opt).appendTo(obj);
                 }
             }
             obj.change();
         }).change();
         obj.val(val).change();
     });
 
     $(selector).find('SELECT.buttonset').each(function () {
         var parent = $(this).parent();
         var sel = $(this).hide();
         if (sel.val() == '')
             sel.val($(this).find('OPTION[value!=""]').first().val());
         var div = $('<div>').attr('id', this.id + '_div').appendTo(parent);
         for (var i = 0; i < this.options.length; i++)
         {
             var opt = this.options[i];
             if (opt.value == '')
                 continue;
             var id = this.id + '_opt_' + i;
             var checked = opt.selected ? 'checked' : '';
             $('<input type="radio" ' + checked + ' id="' + id + '" name="' + this.id + '" ' +
                     'value="' + opt.value + '"><label for="' + id + '">' + opt.text + '</label>').appendTo(div);
         }
         var cb = function (inp) {
             inp.closest('DIV').find('INPUT')
                     .button("option", "icons", {primary: 'ui-icon-radio-off'});
             inp.button("option", "icons", {primary: 'ui-icon-circle-check'});
         };
         div.buttonset();
         div.find('INPUT')
                 .button("option", "icons", {primary: 'ui-icon-radio-off'})
                 .change(function () {
                     sel.val(this.value).change();
                     cb($(this));
                 });
         div.find('INPUT:checked').change();
         sel.change(function () {
             var div = $(this).parent().find('DIV.ui-buttonset');
             var inp = div.find('INPUT[value="' + this.value + '"]').prop('checked', true);
             cb(inp);
             div.find('INPUT').button('refresh');
         });
     });
 
     $(selector).find('TEXTAREA.textarea_list').each(function(){
         var parent = $(this).parent();
         var div = parent.find('DIV.textarea_list_div');
         if (div.length > 0)
             return;
         div = $('<div>').addClass('textarea_list_div clearfix').appendTo(parent);
         div.attr('list_for', $(this).attr('id'));
         TextAreaListItemsRefresh(div);
         div.sortable({items: 'span', helper: 'clone', handle: ".fa-ellipsis-v", stop: function(){ TextAreaListItemsSave(div); }});
     });
     if (typeof $.fn.tooltip == 'function')
         $(selector).find('INPUT[title]').tooltip();
     var promptCb = function(evt){
         if ($(this).val() == 'Diğer')
         {
             $(this).find('OPTION:first').attr('selected', 'selected');
             $(this).trigger("chosen:updated");
             var select = this;
             var id = '#' + $(this).attr('id').replace(/\./, "\\.");
             Page.ShowPrompt(Form.GetInputTitle(id), '', function(val){
                 if (! val)
                     return false;
                 $('<option>').html(val).appendTo(select);
                 $(select).val(val).trigger("chosen:updated");
                 return true;
             });
         }
     };
     if ($(selector).find('SELECT[editable_list=1]').length > 0)
         $(selector).find('SELECT[editable_list=1]').each(function(){
             var obj = $(this);
             var val = this.attributes['value'] ? this.attributes['value'].value : null;
             if (val && obj.find('OPTION[value="' + val + '"]').length == 0)
             {
                 $('<option>').html(val).appendTo(obj);
                 obj.val(val);
             }
             obj.chosen({width: "95%"}).change(promptCb);
         });
 };
 
 function TextAreaListItemsRefresh(div)
 {
     div.html('');
     var inp = $('#' + div.attr('list_for'));
     var val = $(inp).val() || '';
     var items = val.split("\n");
     for(var i=0; i<items.length; i++)
     {
         if (items[i] == '')
             continue;
         var del = $('<i class="fa fa-times">').click(TextAreaListItemDel);
         var sort = $('<i class="fa fa-ellipsis-v">');
         $('<span>').addClass('btn btn-default btn-xs')
             .appendTo(div).append(items[i]).append(sort).append(del).click(TextAreaListItemEdit);
     }
     $('<i class="btn btn-success btn-sm fa fa-plus">').appendTo(div).click(TextAreaListItemAdd);
 }
 
 function TextAreaListItemsSave(div)
 {
     var txt = div.parent().find('TEXTAREA');
     var items = [];
     div.find('SPAN').each(function(){
         items.push($(this).text());
     });
     txt.val(items.join("\n"));
 }
 
 function TextAreaListItemDel()
 {
     var div = $(this).closest('.textarea_list_div');
     $(this).parent().remove();
     TextAreaListItemsSave(div);
 }
 
 function TextAreaListItemAdd()
 {
     var that = $(this);
     var div = that.closest('.textarea_list_div');
     Page.ShowPrompt("Ekle", '', function(item){
         if (!item)
             return Page.ShowError(COMMONLANG.ENTER_VALID_VALUE);
         var del = $('<i class="fa fa-times">').click(TextAreaListItemDel);
         var sort = $('<i class="fa fa-ellipsis-v">');
         $('<span>').addClass('btn btn-default btn-xs')
             .appendTo(div).append(item).append(sort).append(del).click(TextAreaListItemEdit);
         TextAreaListItemsSave(div);
         that.appendTo(div);
         return true;
     });
 }
 
 function TextAreaListItemEdit()
 {
     var that = $(this);
     var div = that.closest('.textarea_list_div');
     Page.ShowPrompt("Değiştir", $(this).text(), function(item){
         if (!item)
             return Page.ShowError(COMMONLANG.ENTER_VALID_VALUE);
         var del = $('<i class="fa fa-times">').click(TextAreaListItemDel);
         var sort = $('<i class="fa fa-ellipsis-v">');
         that.html('').append(item).append(sort).append(del);
         TextAreaListItemsSave(div);
         return true;
     });
 }
 
 Jui.InitTables = function (selector)
 {
     selector = selector || 'body';
     $(selector).find('.jui-table THEAD TD').addClass('ui-state-focus').css('font-weight', 'bold');
     $(selector).find('.jui-table').each(function () {
         if ($(this).hasClass('header'))
             $(this).children('THEAD').find('TD')
                     .removeClass('ui-state-focus')
                     .addClass('ui-widget-header');
     });
     var bclr = Jui.GetCssValue('ui-state-focus', 'background-color');
     $(selector).find('.jui-table').each(function () {
         if ($(this).hasClass('dark-border-color'))
             bclr = 'gray';
         $(this).find('TD').css('border', '1px solid ' + bclr);
     });
     $(selector).find('TBODY[var_type="sortable"]').each(function () {
         $(this).sortable();
         if ($(this).attr('add_handle'))
         {
             var tds = $(this).find('TR TD:first-child:not(.move_handle)');
             tds.css({position: 'relative', paddingLeft: '20px'});
             $('<i class="fa fa-th"></i>').css({
                 position: 'absolute', left: '2px', top: '30%', bottom: '2px',
                 fontSize: '14px', cursor: 'move', color: 'grey'
             }).prependTo(tds);
             tds.addClass('move_handle');
         }
         var tbl = $(this).parent();
         var foot = $(tbl).find('tfoot');
         if (foot.length == 0)
             foot = $('<tfoot>').appendTo(tbl);
         if (!foot.attr('sortable_info'))
         {
             var tr = $('<tr><td colspan="' + tbl.find('TR').first().find('TD').length + '">' +
                     '</td></tr>').appendTo(foot);
             foot.attr('sortable_info', 1);
             tr.find('TD').addClass('ui-state-focus')
                     .html('<small>' + COMMONLANG.TABLE_IS_SORTABLE + '</small>')
                     .css({padding: '5px 0px 5px 20px', background: 'url(' + img + ') no-repeat scroll 3px 8px',
                 'white-space':'normal'});
         }
     });
 };
 
 var BSuiTabIndex = 0;
 BSui.tabs = function(selector, tabAlign)
 {
     if (typeof tabAlign == "undefined")
         tabAlign = 'right';
     var obj = $(selector);
     if (obj.hasClass('tabbed'))
         return;
     var tabTitle =	obj.attr('title');
     if (tabTitle == null)
         tabTitle = '';
     var container = $(
         '<div class="portlet light ">' +
         '	<div class="portlet-title tabbable-line">' +
         '		<div class="caption caption-md">' +
         '			<i class="icon font-blue-madison bold"></i>' +
         '			<span class="caption-subject font-blue-madison bold uppercase">' + tabTitle + '</span>' +
         '		</div>' +
         '		<ul class="nav nav-tabs nav-ers-tab" style="float: ' + tabAlign + '"></ul>' +
         '	</div>' +
         '	<div class="portlet-body clearfix">' +
         '		<div class="tab-content"></div>' +
         '	</div>' +
         '</div>'
     );
     obj.before(container);
     container.attr('tab_index', BSuiTabIndex);
     container.find('SPAN.caption-subject').html(obj.attr('title'));
     container.find('I.icon').addClass(obj.attr('icon'));
     var tabs = obj.find('>DIV');
     var currTab = Page.GetParameter('tab' + (BSuiTabIndex == 0 ? '': BSuiTabIndex), 0);
     var bsTabs = Page.GetParameter('bs-tabs');
     if (bsTabs)
     {
         var values = bsTabs.split(',');
         if (typeof values[BSuiTabIndex] != "undefined")
             currTab = values[BSuiTabIndex];
     }
     for(var i=0; i<tabs.length; i++)
     {
         var title = tabs.eq(i).attr('title');
         var url = tabs.eq(i).attr('url');
         var id = tabs.eq(i).attr('id');
         if (! id)
             id = 'bs_tabs_' + i;
         tabs.eq(i)
             .appendTo(container.find('.tab-content'))
             .addClass('tab-pane' + (currTab == i ? ' active' : ''))
             .attr('id', id);
         var li = $('<li><a href="" data-toggle="tab"></a></li>').appendTo(container.find('UL.nav'));
         if (currTab == i)
             li.addClass('active');
         var a = li.find('A:first').html(title);
         if (url)
         {
             var parts = ParamsFromStr(url);
             parts['tab' + (BSuiTabIndex == 0 ? '': BSuiTabIndex)] = i;
             url = window.location.href;
             for(var name in parts)
                 url = Page.UrlChangeParam(name, parts[name], url);
             a.attr('href', url);
             li.click(function(e){
                 window.location.href = $(this).find('A:first').attr('href');
                 e.stopPropagation();
             });
         }
         else
             a.attr('href', '#' + id);
     }
 
     container.attr('id', obj.attr('id'));
     obj.remove();
     BSuiTabIndex++;
 };
 
 function ParamsFromStr(paramStr)
 {
     paramStr = paramStr.replace(/[?]/g, '');
     var params = paramStr.split('&');
     var arr = {};
     for(var i=0; i<params.length; i++)
     {
         var parts = params[i].split('=');
         arr[parts[0]] = parts[1];
     }
     return arr;
 
 }
 
 BSui.DropDownButton = function (items)
 {
     if (typeof $.fn.tooltip.Constructor != "undefined")
         var version = $.fn.tooltip.Constructor.VERSION.substr(0,1);
     else
         var version = 4;
     var div = $('<div class="btn-group" role="group"></div>');
     var first = items[0];
     var btn = $('<button class="btn btn-secondary dropdown-toggle" type="button">'+first.text+'</button>');
     if (version == 5)
         btn.attr("data-bs-toggle","dropdown");
     else
         btn.attr("data-toggle","dropdown");
     var newIcon = BSui.IconMap(first.icon);
     $('<i class="fa">').addClass("fa-"+newIcon).appendTo(btn);
     btn.appendTo(div);
     var ul = $('<ul class="dropdown-menu">');
 
     items.splice(0, 1);
     for (var i = 0; i < items.length; i++)
     {
         var item = items[i];
         var li =  $('<li><a class="dropdown-item"></a></li>');
         var a = li.find('a');
 
         if (item.icon)
         {
             var newIcon = BSui.IconMap(item.icon);
             $('<i class="fa">').addClass("fa-"+newIcon).appendTo(a);
         }
         if (item.text)
             $('<span> ' + item.text + '</span>').appendTo(a);
         if (typeof item.enabled != "undefined" &&
                 !item.enabled)
             a.addClass('disabled');
         if (typeof item.cb == 'function')
         {
             a.attr('href', 'javascript:void(0)');
             a.click(item.cb);
         } else if (item.cb)
         {
             a.attr('href', item.cb);
             if (item.target)
                 a.attr('target', item.target);
         }
         if (item.attr)
             for (var name in item.attr)
                 a.attr(name, item.attr[name]);
         li.appendTo(ul);
 
     }
     ul.appendTo(div);
 
     return div;
 }
 
 BSui.InitButtons = function (selector, buttonSet)
 {
     $('.button_panel').each(function(){
         $(this).removeClass('button_panel').addClass('button_panel_bs');
         if (USE_BS_UI)
         {
             var div = $('<div>').addClass('panel panel-default');
             var div2 = $('<div>').addClass('panel-heading ui-helper-clearfix').appendTo(div);
         }
         else if (USE_BS_UI_4)
         {
             var div = $('<div>').addClass('card');
             var div2 = $('<div>').addClass('card-body').appendTo(div);
         }
         $(this).children().appendTo(div2);
         div.appendTo(this);
         if ($(this).css('position') == 'fixed')
         {
             $(this).find('.panel').css('border-radius', '0');
             $(this).find('.panel-heading').css('border-radius', '0');
             $(this).addClass('');
         }
     });
     selector = selector || 'body';
     var selObj = $(selector);
     var btnClassMap = {
         'btn_ui_save'  : ['btn-success', 'fa-check'],
         'btn_ui_add'   : ['btn-info', 'fa-plus-circle'],
         'btn_ui_person': ['btn-success', 'fa-user'],
         'btn_ui_cancel': ['btn-danger', 'fa-ban'],
         'btn_ui_search': ['btn-success', 'fa-search'],
         'btn_ui_print' : ['btn-info', 'fa-print'],
         'btn_ui_delete' :['btn-danger', 'fa-remove'],
         'btn_ui_default': ['btn-default', '']
     };
     for(var cls in btnClassMap)
     {
         var cls2 = btnClassMap[cls][0];
         var icon = btnClassMap[cls][1];
         selObj.find('BUTTON.' + cls + ',INPUT.' + cls).each(function(){
             if ($(this).hasClass('init-button'))
                 return;
             $(this).addClass('init-button bs-button btn ' + cls2);
             if ($(this).attr('tool') || $(this).attr('toolbar'))
                 $(this).html('');
             $(this).prepend($('<i>').addClass('fa ' + icon));
         });
     }
 
     selObj.find('.jui-button,.bsui-button').each(function () {
         BSui.InitSingleButton(this);
     });
     selObj.find('.bs-button')
             .addClass('btn-sm')
             .removeClass('ui-state-error')
             .removeClass('ui-state-focus');
     if (buttonSet)
     {
         var group = $('<div class="btn-group" role="group">').appendTo(selObj);
         selObj.children('.btn').appendTo(group);
     }
     else
         selObj.find('[toolbar]').addClass('btn-xs');
 
     if (USE_BS_UI_4)
     {
         selObj.find('[toolbar]').addClass('btn-icon');
         selObj.find('[toolbar] .fa').addClass('fa-sm');
     }
 };
 
 BSui.IconMap = function(juiIcon){
     var map = {
         'trash': 'trash',
         'clipboard' : 'clipboard',
         'close' : 'window-close',
         'cancel': 'ban',
         'disk': 'floppy-o',
         'plus': 'plus-circle',
         'plusthick' : 'plus',
         'arrowthick-2-se-nw' : 'arrows-alt',
         'calculator' : 'calculator',
         'document' : 'file-word-o',
         'image' : 'file-pdf-o',
         'refresh' : 'refresh',
         'gear' : 'cog',
         'seek-first': 'fast-backward',
         'seek-prev': 'step-backward',
         'seek-next' : 'step-forward',
         'seek-end' : 'fast-forward',
         'search' : 'search',
         'triangle-1-s': 'chevron-down',
         'wrench' : 'wrench',
         'script' : 'pencil-square-o',
         'info' : 'info-circle',
         'copy' : 'clone',
         'calendar' : 'calendar',
         'circle-close' : 'times-circle',
         'circle-plus' : 'plus-circle',
         'carat-2-e-w' : 'exchange',
         'key' : 'key',
         'print' : 'print',
         'check' : 'check',
         'power' : 'power-off',
         'newwin' : 'external-link fa-upload',
         'locked': 'lock',
         'unlocked' : 'unlock',
         'mail-closed' : 'envelope',
         'comment' : 'comment',
         'pencil' : 'edit',
         'folder-collapsed' : 'file',
         'home': 'home',
         'signal' : 'signal',
         'pin-w':'thumb-tack'
     };
 
     if (USE_BS_UI_4)
     {
         map.document = 'file-word';
         map.image = 'file-pdf';
         map.refresh = 'sync';
         map.newwin = 'external-link-alt';
         map.disk = 'save';
     }
     if (juiIcon.match(/ui\-icon\-/i))
         juiIcon = juiIcon.substring('ui-icon-'.length)
     var icon = map[juiIcon];
     if (! icon)
     {
         console.log('ui-icon-' + juiIcon + ' bulunamadi...');
         return 'check-circle';
     }
     return icon;
 };
 
 BSui.InitSingleButton = function(btn){
 
     if ($(btn).hasClass('init-button'))
         return;
     var icon = $(btn).attr('icon');
     var pos = $(btn).attr('icon_pos');
     var toolbar = $(btn).attr('toolbar');
     $(btn).addClass('init-button bs-button btn');
     if ($(btn).parents('.button_panel_bs').length > 0)
         $(btn).addClass('btn-primary');
     else
         $(btn).addClass('btn-info');
     if (toolbar)
         $(btn).html('');
     if (icon)
     {
         var icon2 = BSui.IconMap(icon);
         if (icon2 == 'ban')
             $(btn)
                 .removeClass('btn-primary')
                 .removeClass('btn-info')
                 .addClass('btn-danger');
         var i = $('<i>').addClass('fa fa-' + icon2);
         if (pos == 'right')
             i.appendTo(btn);
         else
             $(btn).prepend(i);
     }
 };
 var _cbIdIndex = 1;
 BSui.InitCheckboxes = function(parentSelector)
 {
     $(parentSelector).find('INPUT[type="checkbox"]:not(.styled):not(.make-switch)').each(function(){
         var defStyle = 'success';
         if ($(this).parents('.dataTables_wrapper').length > 0)
             defStyle = 'primary';
         var div = $('<div class="checkbox checkbox-' + defStyle + '">');
         var cb = $(this);
         cb.before(div);
         cb.addClass('styled');
         var par = cb.parent();
         if (! cb.attr('id'))
         {
             cb.attr('id', '_cb_' + _cbIdIndex++);
             var label = par.find('LABEL');
             if (label.length > 0)
                 label.attr('for', cb.attr('id'));
         }
         var id = cb.attr('id');
         cb.appendTo(div);
         var label = par.find('LABEL[for="' + id + '"]');
         if (label.length == 0)
             label = $('<label>').attr('for', id);
         label.appendTo(div);
     });
 };
 
 Jui.InitCheckboxes = function(parentSelector){
     $(parentSelector).find('INPUT.tristate[type="checkbox"]').each(function(){
         var el = $(this);
         if (el.hasClass('tristate-handled') || dtTableIds.length == 0)
             return true;
         el.data('checked', 0).addClass('tristate-handled');
         var clickCb = el.attr('onclick');
         var table = $('#' + dtTableIds[0]);
         el.attr('onclick', '').attr('_onclick', clickCb);
         el.click(function(e){
             switch(el.data('checked')) {
                 case 0:
                     el.data('checked',1);
                     el.prop('indeterminate',true);
                     break;
                 case 1:
                     el.data('checked',2);
                     el.prop('indeterminate',false);
                     el.prop('checked',true);
                     break;
                 default:
                     el.data('checked',0);
                     el.prop('indeterminate',false);
                     el.prop('checked',false);
             }
             table.checkAllRows(el.prop('checked'));
             table.find('[field_name="Sec"] INPUT[type="checkbox"]').prop('disabled',
                 el.prop('checked') && ! el.prop('indeterminate'));
             eval(clickCb);
         });
 
         table.gridLoad(function(e){
             var cbs = $(this).find('[field_name="Sec"] INPUT[type="checkbox"]');
             cbs.click(function(){
                 eval(clickCb);
             });
             if (el.prop('checked') && ! el.prop('indeterminate'))
             {
                 $(this).checkAllRows(true);
                 cbs.prop('disabled', true);
             }
             else
             {
                 el.prop('checked', false).prop('indeterminate', false).data('checked', 0);
                 cbs.prop('disabled', false);
             }
             eval(clickCb);
         });
 
         table.gridLoad();
     });
     if (USE_BS_UI)
         return BSui.InitCheckboxes(parentSelector);
 
 };
 
 Jui.DisableButton = function(obj, disable)
 {
     obj = $(obj);
     obj.prop('disabled', disable);
     if (obj.hasClass('ui-button'))
         obj.button(disable ? 'disable' : 'enable');
 }
 
 Jui.InitButtons = function (selector, buttonSet)
 {
     if (USE_BS_UI || USE_BS_UI_4)
         return BSui.InitButtons(selector, buttonSet);
     $('.button_panel').addClass('ui-widget-header');
     selector = selector || 'body';
     $(selector).find('BUTTON.btn_ui_save,INPUT.btn_ui_save')
             .attr('icon', 'ui-icon-disk')
             .addClass('jui-button');
     $(selector).find('BUTTON.btn_ui_add,INPUT.btn_ui_add')
             .attr('icon', 'ui-icon-circle-plus')
             .addClass('jui-button');
     $(selector).find('BUTTON.btn_ui_person,INPUT.btn_ui_add')
             .attr('icon', 'ui-icon-person')
             .addClass('jui-button');
     $(selector).find('BUTTON.btn_ui_cancel,INPUT.btn_ui_cancel')
             .attr('icon', 'ui-icon-cancel')
             .addClass('jui-button')
             .addClass('ui-state-error-text');
     $(selector).find('BUTTON.btn_ui_delete,INPUT.btn_ui_delete')
             .attr('icon', 'ui-icon-closethick')
             .addClass('ui-state-error-text jui-button');
     $(selector).find('BUTTON.btn_ui_search,INPUT.btn_ui_search')
             .attr('icon', 'ui-icon-search')
             .addClass('jui-button');
     $(selector).find('BUTTON.btn_ui_print')
             .attr('icon', 'ui-icon-print')
             .addClass('jui-button');
 
     $(selector).find('.jui-button:not(.init-button)').each(function () {
         var options = {};
         if ($(this).attr('icon') && $(this).attr('icon_pos') == 'right')
             options.icons = {secondary: $(this).attr('icon')};
         else if ($(this).attr('icon'))
             options.icons = {primary: $(this).attr('icon')};
         if ($(this).attr('toolbar') || $(this).attr('tool'))
             options.text = false;
         $(this).button(options).addClass('init-button');
     });
     if (buttonSet)
         $(selector).buttonset();
     return $(selector);
 };
 
 Jui.InitPages = function ()
 {
     var pages = $('[page_link]');
     pages.css('cursor', 'pointer');
     $('[page_link]').click(function () {
         var pg = $(this).attr('onclick');
         var id = $(this).attr('row_id');
         var param = $(this).attr('row_id_param');
         if (! param)
             param = 'id';
         var obj = {};
         if (id)
             obj[param] = id;
         Page.Open(window[pg], obj);
     });
 };
 
 Jui.GetCssValue = function (className, cssName)
 {
     var element = $('.'.className).first();
     if (element.length == 0)
         element = $('<div>').html('&nbsp;').addClass(className)
                 .appendTo('body').css('display', 'none');
     return element.css(cssName);
 };
 
 Jui.HtmlTooltip = function (selector)
 {
     selector = selector || 'body';
 //	$(selector).tooltip({
 //		content: function () {
 //			return $(this).prop('title');
 //		}
 //	});
 };
 
 RichEdit = {};
 RichEdit.DefaultConf = {
     plugins: 'print preview paste importcss searchreplace autolink autosave save directionality visualblocks visualchars fullscreen image link media table charmap hr pagebreak nonbreaking anchor toc advlist lists textcolor wordcount imagetools contextmenu colorpicker textpattern code noneditable charmap emoticons',
     toolbar: 'undo redo | bold italic underline strikethrough forecolor backcolor | link | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent | numlist bullist | removeformat | table tabledelete | image media  | code | paste',
     toolbar_sticky: true,
     paste_data_images: true,
     images_upload_handler: function (blobInfo, success, failure) {
         success("data:" + blobInfo.blob().type + ";base64," + blobInfo.base64());
     },
     editor_selector: "rich_edit",
     convert_urls: false,
     image_advtab: true,
     valid_children: "+body[style]",
     branding: false,
     language: 'tr_TR',
     toolbar_mode: 'sliding',
     entity_encoding : "raw",
     paste_word_valid_elements: "@[style],-strong/b,-em/i,-span,-p,-ol,-ul,-li,-h1,-h2,-h3,-h4,-h5,-h6,-table[border|cellspacing|cellpadding|frame|rules|align|summary|style|class],-tr[rowspan|align|valign|style],tbody,thead,tfoot,#td[colspan|rowspan|align|valign|scope|style],#th[colspan|rowspan|align|valign|scope|style],-a[href|title],img[src|title|alt|class],sub,sup,strike,caption,br",
     paste_retain_style_properties: "color font font-family font-size border border-top border-left border-bottom border-right border-color width height background background-color margin margin-top margin-left margin-bottom margin-right padding padding-top padding-left padding-bottom padding-right",
     setup: function (editor) {
         editor.on('change', function () {
             tinymce.triggerSave();
         });
     }
 };
 
 RichEdit.GetDefaultConf = function(){
     var conf = RichEdit.DefaultConf;
     var base = $('BASE');
     if (base.length > 0 && base.attr('href'))
         conf.document_base_url = base.attr('href');
     return conf;
 }
 
 RichEdit.GetBasicConf = function(){
     var conf = $.extend({}, RichEdit.GetDefaultConf());
     conf.menubar = false;
     return conf;
 };
 
 RichEdit.Init = function (selector)
 {
     selector = selector || 'body';
     var edits = $(selector).find('[rich_edit="1"]');
     var divEdits = $(selector).find('TEXTAREA.rich_edit_div');
     if (edits.length > 0 || divEdits.length > 0)
     {
         tinymce.init(RichEdit.GetDefaultConf());
         tinyMCEInited = 1;
 
         for (var i = 0; i < edits.length; i++)
         {
             var simple = edits.eq(i).attr('basic_toolbar');
             var id = edits.eq(i).attr('id');
             if (simple != null)
             {
                 var conf = RichEdit.GetBasicConf();
                 conf.selector = '#' + id;
                 tinymce.init(conf);
             }
             else
                 tinymce.init(RichEdit.GetDefaultConf());
             tinymce.execCommand('mceAddEditor', false, id);
         }
     }
 
     divEdits.each(function(){
         var parent = $(this).parent();
         if (parent.find('DIV.rich_edit_div').length > 0)
             return;
         var val = $(this).val();
         $(this).hide();
         $('<div>').addClass('rich_edit_div').html(val).attr('title', $(this).attr('title'))
                 .appendTo(parent).click(RichEditDivClick);
     });
 };
 
 
 
 function RichEditDivClick()
 {
     var that = this;
     var inp = $(this).parent().find('textarea');
     richEditLastInput = inp;
     var div = $('#rich_edit_div_form');
     var txtId = 'rich_edit_div_txt';
     if (div.length == 0)
     {
         div = $('<div>').attr('id', 'rich_edit_div_form').appendTo('body');
         $('<textarea>').attr('id', txtId).appendTo(div).val(inp.val());
         if (inp.attr('basic_toolbar') != null)
         {
             var conf = RichEdit.GetBasicConf();
             conf.selector = '#' + txtId;
             tinymce.init(conf);
         }
         else
             tinymce.init(RichEdit.GetDefaultConf());
         tinyMCE.execCommand('mceAddEditor', false, txtId);
     }
     else
         tinymce.get(txtId).setContent(inp.val());
 
     var cb = function(){
         var val = tinymce.get(txtId).getContent();
         $(that).html(val);
         inp.val(val);
         return true;
     };
     Page.ShowDialog('rich_edit_div_form', 1000, 600, cb);
     $('.ui-dialog-title').html(Form.GetInputTitle(inp));
 
     var editor = tinymce.get(txtId);
     if (editor)
         editor.remove();
     tinymce.execCommand('mceAddEditor', false, txtId);
     var editor = tinymce.get(txtId);
     editor.setContent(inp.val());
 }
 
 Form = {};
 /**
  *
  * @param {string} selector belli bir kurala uyan veya sayfadaki tüm inputların
  * value değerlerini sayfa parametrelerinden alır.
  * @returns {undefined}
  */
 Form.SetValueFromUrl = function (selector)
 {
     var items;
     var types = 'input,select';
     if (is_set(selector))
         items = $(selector).find(types);
     else
         items = $(types);
     for (var i = 0; i < items.length; i++)
     {
         var item = $(items[i]);
         var key = item.attr('name');
         if (!key)
             key = item.attr('id');
         if (!key)
             continue;
         var val = Page.GetParameter(key, null);
         if (val === null)
             continue;
         if (item.attr('type') == 'checkbox')
             item.prop('checked', val.match(/^1|on$/g));
         else
             item.val(val);
     }
 };
 
 Form.SetFromObj = function (obj, parent, ignoreId)
 {
     if (typeof obj == "string")
         obj = JSON.parse(obj);
     parent = parent || 'body';
     parent = $(parent);
     if (typeof ignoreId == "undefined")
         ignoreId = false;
     for (var name in obj)
     {
         if (! name || typeof obj[name] == "function")
             continue;
         try {
             var el = $('#' + name);
             if (el.length == 0 || ignoreId)
                 el = $(parent).find('[name="' + name + '"]');
             if (el.length == 0)
                 el = $(parent).find('.' + name);
             if (el.length == 0)
                 continue;
             Form.SetValue(el, obj[name]);
         } catch (ex) {
             console.log ('Name=' + name + ', Value=' + obj[name]);
         }
     }
 };
 
 Form.ParseTemplate = function (obj, temp)
 {
     temp = String(temp);
     for (var name in obj)
     {
         if (! name || typeof obj[name] == "function" || typeof obj[name] == "object")
             continue;
         obj[name] = new String(obj[name]);
         obj[name] = obj[name].replace(/\\(['"])/g, '$1', obj[name]);
         var reg = new RegExp('#' + name + '\\b', 'g');
         temp = temp.replace(reg, obj[name]);
     }
 
     var element = $(temp);
     element.find('.image-lazy:not(.lazy)').each(function(){
         var dataSrc = $(this).attr('data-src');
         if (dataSrc)
             $(this).attr('src', dataSrc);
     });
     return element.prop('outerHTML');
 };
 
 Form.ActiveBsTabs = function (inp) {
     $(inp).parents('.tab-pane').each(function () {
         $('a[href="#' + $(this).attr('id') + '"]').click();
     });
 };
 
 // verilen sınıfdaki inputların doldurulup doldurulmadığını verir
 Form.CheckRequest = function (selector)
 {
     var inputs = $(selector);
     for (var i = 0; i < inputs.length; i++) {
         var richEdit = null;
         var inp = inputs[i];
         var val = Form.GetValue(inp);
         var upload_type = $(inp).attr('upload_type');
         if(typeof upload_type != 'undefined')
         {
             if (upload_type == UploadTypeSingle)
                 val = $(inp).find('.upload input').attr('file_name');
             if(upload_type == UploadTypeImage)
             {
                 var img = $(inp).find('img');
                 val = '';
                 if(img.attr('default_src') != img.attr('src'))
                     val = img.attr('src');
             }
             if (upload_type == UploadTypeMulti)
                 val = $(inp).find('TR.file').attr('data');
             if (upload_type == UploadTypeImageMulti)
             {
                 val = "";
                 if($(inp).find('.multi-image-gallery').html() != "")
                     val = $(inp).find('.multi-image-gallery img').attr('src');
             }
         }
         var errorMsg = '';
         if ($(inp).hasClass('hasDatepicker') && !Tarih.Kontrol(val, true))
             errorMsg = COMMONLANG.FIELD_VALID_DATE;
         else if (typeof $(inp).inputmask == 'function' && ! $(inp).inputmask('isComplete'))
             errorMsg = COMMONLANG.FIELD_VALID_VALUE;
         else if (val == '' || typeof val == 'undefined')
             errorMsg = COMMONLANG.FIELD_MANDATORY;
         if (errorMsg != '') {
             var nm = Form.GetInputTitle(inp);
             if( $(inp).attr('rich_edit') == '1')
                 richEdit = $(inp);
 
             Page.ShowError(errorMsg.format(nm) + ".", function () {
                 Form.ActiveBsTabs(inp);
                 if (richEdit)
                 {
                     tinymce.get(richEdit.attr('id')).getBody().style.backgroundColor = 'pink';
                     setTimeout(function(){
                         tinymce.get(richEdit.attr('id')).getBody().style.backgroundColor = 'white';
                     },2000);
                 }
                 else
                 {
                     var chz = $('#'+ inp.id + '_chosen');
                     if (chz.length > 0)
                         selectedInp = chz.parent();
                     else
                         selectedInp = inp
                     setTimeout("HighlightField(selectedInp);", 100);
                 }
             });
             return false;
         }
     }
     return true;
 };
 
 Form.GetInputTitle = function(inp)
 {
     inp = $(inp);
     var nm = inp.closest('TR').find('LABEL[for="' + inp.attr('id') + '"]').text();
 
     if (!nm)
         nm = inp.closest('.form-group').find('LABEL[for="' + inp.attr('id') + '"]').text();
     if (!nm)
     {
         var attrs = ['display_name','title', 'placeholder', 'name', 'id'];
         for (var k = 0; k < attrs.length; k++)
         {
             var title = inp.attr(attrs[k]);
             if (title != null && title != '')
             {
                 nm = title;
                 break;
             }
         }
     }
     return nm;
 };
 // verilen sınıfdaki inputların değerlerini dizi olarak verir
 Form.GetDataList = function (clsName, parent)
 {
     if (typeof parent == 'undefined')
         parent = 'body';
     var inputs = $(parent).find('.' + clsName);
     var sonuc = new Object();
     for (var i = 0; i < inputs.length; i++)
     {
         var inp = inputs[i];
         var fName = $(inp).attr('field');
         var name = inp.id;
         if (fName)
             name = fName;
         if ($(inp).attr('upload_type') && typeof UploadTypeObj != "undefined")
         {
             var type = parseInt($(inp).attr('upload_type'));
             if (name)
                 sonuc[name] = UploadTypeObj[type].GetData(inp);
             continue;
         }
         if ($(inp).hasClass('inp_picker'))
         {
             name = $(inp).attr('field');
             var txtField = $(inp).attr('text_field');
             if (name)
             {
                 sonuc[name] = $(inp).find('.id_field').val();
                 sonuc[txtField] = $(inp).find('.text_field').val();
             }
             continue;
         }
         if (inp.getAttribute('field'))
             name = inp.getAttribute('field');
         if (name)
             sonuc[name] = Form.GetValue(inp);
     }
 
     return sonuc;
 };
 
 Form.GetValue = function (inp, wnd)
 {
     if (typeof wnd != "undefined")
         inp = wnd.$(inp, wnd.document);
     else
         inp = $(inp);
     if (inp.attr('rich_edit') == '1')
     {
         var richEdit = tinymce.get(inp.attr('id'));
         if (richEdit)
             inp.val(richEdit.getContent());
     }
     var val = null;
     if (inp.is('TEXTAREA,INPUT,SELECT'))
         val = inp.val();
     else
         val = inp.html();
     if (inp.hasClass('textarea_list'))
     {
         val = new Array();
         var inpVal = inp.val();
         if(inpVal != '');
             val=inpVal.split('\n');
     }
     if (inp.hasClass('autoNumeric'))
     {
         try {
             val = inp.autoNumeric('get');
         } catch(e) {
             val = Number.Parse(inp.val());
         }
         val = parseFloat(val) || 0;
     }
     if (inp.hasClass('IntPhone') && typeof inp.data('plugin_intlTelInput') != "undefined")
     {
         var intlTel = inp.data('plugin_intlTelInput');
         val = intlTel.getNumber(intlTelInputUtils.numberFormat.INTERNATIONAL);
     }
     if (inp.prop('type') == 'checkbox')
         val = inp.prop('checked') ? 1 : 0;
     else if (inp.prop('type') == 'radio')
         val = inp.filter(function(){ return $(this).prop('checked');}).val();
     if (inp.attr('custom_format') == 'number')
     {
         if (val == '')
             val = 0;
         else
             val = Number.Parse(val);
     }
     return val;
 };
 
 Form.SetValue = function (inp, val, wnd)
 {
     if (typeof wnd != "undefined")
         inp = wnd.$(inp, wnd.document);
     else
         inp = $(inp);
     if (inp.length == 0)
         return inp;
     if ($(inp).attr('rich_edit') == '1')
     {
         var richEdit = tinymce.get(inp.attr('id'));
         if (richEdit)
             richEdit.setContent(val);
     }
     else if (inp.prop('tagName') == 'SELECT' && val)
     {
         var opt = inp.find('OPTION').filter(function(){
             if (inp.prop('multiple') && $.isArray(val) && $.inArray($(this).val(), val) >= 0)
                 return true;
             if ($(this).val() == val)
                 return true;
             return false;
         });
         if (opt.length == 0)
             opt = $('<option></option>').val(val).html(val).appendTo(inp);
         opt.prop('selected', true);
     }
     else if (inp.hasClass('autoNumeric'))
     {
         try {
             var numVal = val;
             if (isNaN(numVal))
                 numVal = Number.Parse(numVal);
             inp.autoNumeric('set', val == '' || val == null ? 0 : numVal);
         } catch(e) {
             inp.val(parseFloat(val));
         }
     }
     else if(inp.hasClass('rich_edit_div'))
         inp.val(String.DecodeEntities(val, true)).parent().find('DIV.rich_edit_div').html(String.DecodeEntities(val, true));
     else if (inp.attr('type') == 'checkbox')
         inp.prop('checked', val == 1);
     else if (inp.attr('type') == 'radio')
         inp.each(function(){ $(this).prop('checked', val == $(this).val());});
     else if (typeof inp.get(0).type != "undefined" || inp.get(0).tagName == 'TEXTAREA')
         inp.val(String.DecodeEntities(val));
     else
         inp.html(val);
     if (inp.attr('editable_list') == 1)
         inp.trigger("chosen:updated");
     return inp;
 };
 
 /**
  <pre>
  Verilen satırlardaki attribute ve/veya satır içi selector değerlerini
  dizi dizisi olarak döndürür
 
  Ör:
  Form.GetTrDataList(
  '.cihaz-degerlendirme',
  ['UrunId', 'FirmaId', 'Tur', 'Uygun=TD.uygun SELECT', 'Degerlendirme=TEXTAREA'])
 
  veya
  Form.GetTrDataList('TR.field-row',
  ['Field=.Field', 'Properties=.Properties'], 'Field!=""')
  veya
  Form.GetTrDataList(selector, 'ad,soyad') <==> Form.GetTrDataList(selector, ['ad=.ad', 'soyad=.soyad'])
  </pre>
  * @param {type} selector
  * @param {type} AttrNames
  * @param {type} validationCondition
  * @param {type} errorCondition
  * @param {type} errorMessage
  * @returns {Array|Form.GetTrDataList.records}
  *
  */
 Form.GetTrDataList = function (selector, AttrNames, validationCondition, errorCondition, errorMessage)
 {
     var rows = $(selector);
     var records = [];
     if (typeof AttrNames == "string")
     {
         var names = AttrNames.split(',');
         AttrNames = [];
         for (var i = 0; i < names.length; i++)
             AttrNames.push(names[i] + '=.' + names[i]);
     }
     for (var i = 0; i < rows.length; i++)
     {
         var row = rows.get(i);
         var r = {Id: -1};
         if ($(row).attr('row_id'))
             r.Id = $(row).attr('row_id');
         for (var a = 0; a < AttrNames.length; a++) {
             var name = AttrNames[a];
             var eslestirme = name.match(/([a-z_0-9]+)=([^:]*)(:.*)?/i);
             if (eslestirme)
             {
                 name = eslestirme[1];
                 selector = eslestirme[2];
                 var attr = eslestirme[3];
                 var obj = $(row).find(selector);
                 if (obj.length == 0)
                     continue;
                 if (attr)
                     r[name] = obj.attr(attr.substring(1));
                 else if (obj.hasClass('autoNumeric'))
                     r[name] = $(obj).value();
                 else
                 {
                     if (obj.is('INPUT[type="checkbox"]'))
                         r[name] = obj.attr('checked') ? 1 : 0;
                     else if (obj.is('TEXTAREA,INPUT,SELECT'))
                         r[name] = obj.val();
                     else
                         r[name] = obj.html();
                     if (obj.attr('custom_format') == 'number')
                         r[name] = Number.Parse(r[name]);
                 }
             } else
                 r[name] = row.getAttribute(name);
         }
         
     }
     return records;
 };
 

/**
 <pre>
 Verilen satırlardaki attribute ve/veya satır içi selector değerlerini
 dizi dizisi olarak döndürür

 Ör:
 Form.GetTrDataList(
 '.cihaz-degerlendirme',
 ['UrunId', 'FirmaId', 'Tur', 'Uygun=TD.uygun SELECT', 'Degerlendirme=TEXTAREA'])

 veya
 Form.GetTrDataList('TR.field-row',
 ['Field=.Field', 'Properties=.Properties'], 'Field!=""')
 veya
 Form.GetTrDataList(selector, 'ad,soyad') <==> Form.GetTrDataList(selector, ['ad=.ad', 'soyad=.soyad'])
 </pre>
 * @param {type} selector
 * @param {type} AttrNames
 * @param {type} validationCondition
 * @param {type} errorCondition
 * @param {type} errorMessage
 * @returns {Array|Form.GetTrDataList.records}
 *
 */
 Form.GetTrDataList = function (selector, AttrNames, validationCondition, errorCondition, errorMessage)
 {
     var rows = $(selector);
     var records = [];
     if (typeof AttrNames == "string")
     {
         var names = AttrNames.split(',');
         AttrNames = [];
         for (var i = 0; i < names.length; i++)
             AttrNames.push(names[i] + '=.' + names[i]);
     }
     for (var i = 0; i < rows.length; i++)
     {
         var row = rows.get(i);
         var r = {Id: -1};
         if ($(row).attr('row_id'))
             r.Id = $(row).attr('row_id');
         for (var a = 0; a < AttrNames.length; a++) {
             var name = AttrNames[a];
             var eslestirme = name.match(/([a-z_0-9]+)=([^:]*)(:.*)?/i);
             if (eslestirme)
             {
                 name = eslestirme[1];
                 selector = eslestirme[2];
                 var attr = eslestirme[3];
                 var obj = $(row).find(selector);
                 if (obj.length == 0)
                     continue;
                 if (attr)
                     r[name] = obj.attr(attr.substring(1));
                 else if (obj.hasClass('autoNumeric'))
                     r[name] = $(obj).value();
                 else
                 {
                     if (obj.is('INPUT[type="checkbox"]'))
                         r[name] = obj.attr('checked') ? 1 : 0;
                     else if (obj.is('TEXTAREA,INPUT,SELECT'))
                         r[name] = obj.val();
                     else
                         r[name] = obj.html();
                     if (obj.attr('custom_format') == 'number')
                         r[name] = Number.Parse(r[name]);
                 }
             } else
                 r[name] = row.getAttribute(name);
         }
         if (typeof validationCondition != "undefined" && validationCondition)
             with (r) {
                 var s = eval(validationCondition);
                 if (!s)
                     continue;
             }
         if (typeof errorCondition != "undefined" && errorCondition)
             with (r) {
                 var s = eval(errorCondition);
                 if (s)
                 {
                     var els = $(row).find('INPUT:visible,SELECT:visible');
                     if (els.length == 0)
                         els = row;
                     if (typeof errorMessage == "undefined")
                         errorMessage = COMMONLANG.INPUT_ERROR;
                     Page.ShowError(errorMessage, function () {
                         HighlightField(els);
                     });
                     return null;
                 }
             }
         records[records.length] = r;
     }
     return records;
 };

 // Verilen selector listesinin html/value'sunu döndürür. Eğer attr verilirse
 // istenen attr değerleri listesi döndürülür
 Form.GetValueList = function (selector, attr)
 {
     var list = [];
     $(selector).each(function () {
         var val = null;
         if (is_set(attr))
             val = $(this).attr(attr);
         else
             val = $(this).is('TEXTAREA,INPUT,SELECT') != '' ? $(this).val() : $(this).html();
         list.push(val);
     });
     return list;
 };
 
 // Verilen nesne, içindeki değerlere bakarak,
 // sayfa içindeki verilere göre güncellenir
 Form.UpdateObj = function (obj, parentSelector, isGlobal, checkVal)
 {
     if (!is_set(parentSelector) || !parentSelector)
         parentSelector = document;
     if (!is_set(isGlobal))
         isGlobal = false;
     if (!is_set(checkVal))
         checkVal = false;
     for (var name in obj)
     {
         var el = null;
         if (isGlobal && $('#' + name).length > 0)
             el = $('#' + name);
         else if (!isGlobal)
         {
             var els = [
                 $(parentSelector).find('[name="' + name + '"]'),
                 $(parentSelector).find('.' + name)];
             for (var i = 0; i < els.length; i++)
                 if (els[i].length > 0)
                 {
                     el = els[i];
                     break;
                 }
         }
         if (!el)
             continue;
         var val = Form.GetValue(el);
         var valid = val;
         if (el.attr('custom_format') == 'number' || el.hasClass('autoNumeric'))
             valid = val > 0;
         obj[name] = val;
         if (checkVal && !valid && !el.hasClass('optional') && !el.prop('disabled'))
         {
             Page.ShowError(COMMONLANG.MISSING_INPUTS,
                     function () {
                         HighlightField(el);
                     });
             return null;
         }
     }
     return obj;
 };
 
 if (typeof Number == 'undefined')
     Number = {};
 Number.Format = function (a, b, c, d)
 {
     if (typeof b == "undefined")
         b = 2;
     if (typeof c == "undefined")
         c = DECIMAL_SEPARATOR;
     if (typeof d == "undefined")
         d = THOUSAND_SEPARATOR;
     var sign = a < 0;
     a = Math.abs(a);
     a = Math.round(a * Math.pow(10, b)) / Math.pow(10, b);
     var e = a + '';
     var f = e.split('.');
     if (!f[0])
         f[0] = '0';
     if (!f[1])
         f[1] = '';
     if (f[1].length < b)
     {
         var g = f[1];
         for (i = f[1].length + 1; i <= b; i++) {
             g += '0';
         }
         f[1] = g;
     }
 
     if (d != '' && f[0].length > 3)
     {
         var h = f[0];
         f[0] = '';
         for (var j = 3; j < h.length; j += 3) {
             var i = h.slice(h.length - j, h.length - j + 3);
             f[0] = d + i + f[0] + '';
         }
         j = h.substr(0, (h.length % 3 == 0) ? 3 : (h.length % 3));
         f[0] = j + f[0];
     }
     c = (b <= 0) ? '' : c;
     return (sign ? '-' : '') + f[0] + c + f[1];
 };
 
 Number.FormatTL = function(val, decimal)
 {
     return Number.Format(parseFloat(val), decimal) + ' TL';
 }
 
 Number.Parse = function (value, decimal)
 {
     if (value == '')
         return value;
     if (!decimal)
         decimal = -1;
     if (typeof value == "number")
         return decimal >= 0 ? value.toFixed(decimal) : value;
     value = String(value)
             .replace(new RegExp("[^0-9" + DECIMAL_SEPARATOR + "-]", "g"), '')
             .replace(new RegExp("[" + DECIMAL_SEPARATOR + "]", "g"), '.');
     value = parseFloat(value);
     if (decimal >= 0)
         value = value.toFixed(decimal);
     return value;
 };
 
 Number.TryParse = function(value, defaultValue){
     value = Number.Parse(value);
     if (typeof defaultValue == "undefined")
         defaultValue = 0;
     if(isNaN(value))
         value = defaultValue;
     return value;
 };
 
 Number.Round = function (value, n)
 {
     if (! is_set(n))
         n = 2;
     n = Math.pow(10, n);
     return Math.round(n * value) / n;
 }
 
 Tabs = {};
 Tabs.EnableBeforeActivate = true;
 Tabs.GetIndex = function (tabObj) {
     tabObj = tabObj || $('.ui-tabs');
     return $(tabObj).tabs('option', 'active');
 };
 
 Tabs.SetIndex = function (index, tabObj) {
     tabObj = tabObj || $('.ui-tabs');
     return $(tabObj).tabs({active: index});
 };
 
 Tabs.GetIndexByName = function (name, tabObj) {
     tabObj = tabObj || $('.ui-tabs');
     return $(tabObj).find('UL.ui-tabs-nav LI:contains("' + name + '")').index();
 };
 
 Tabs.SetIndexByName = function (name, tabObj) {
     tabObj = tabObj || $('.ui-tabs');
     var index = Tabs.GetIndexByName(name, tabObj);
     if (index > 0)
         return Tabs.SetIndex(index, tabObj);
 };
 
 Tabs.HideTab = function (index, tabObj) {
     tabObj = tabObj || $('.ui-tabs');
     $(tabObj).find('UL.ui-tabs-nav LI:eq(' + index + ')').hide();
 };
 
 Tabs.ShowTab = function (index, tabObj) {
     tabObj = tabObj || $('.ui-tabs');
     $(tabObj).find('UL.ui-tabs-nav LI:eq(' + index + ')').show();
 };
 
 Tabs.ToggleTab = function (index, condition, tabObj) {
     if (condition)
         Tabs.ShowTab(index, tabObj);
     else
         Tabs.HideTab(index, tabObj);
 };
 if (typeof JSON == "undefined")
     JSON = {};
 JSON.TryParse = function (str, defaultObj) {
     try {
         str = String.CleanMsWordChars(str, true);
         obj = JSON.parse(str);
         return obj;
     } catch (e) {
         console.log('JSON.TryParse error: ' + e);
         if (typeof defaultObj == "undefined")
             defaultObj = null;
         return defaultObj;
     }
 };
 
 Array.FindByKey = function (array, key, value)
 {
     if ($.isArray(array))
         for (var i = 0; i < array.length; i++)
         {
             if (array[i][key] == value)
                 return array[i];
         }
     else if ($.isPlainObject(array))
         for (var i in array)
         {
             if (array[i][key] == value)
                 return array[i];
         }
     return null;
 };
 
 Array.RemoveByKey = function(array, key, value){
     var cb = function(obj){
         return obj[key] == value;
     };
     return Array.Remove(array, cb);
 };
 
 Array.Remove = function(array, callBack){
     var newArray = [];
     for (var i=0; i<array.length; i++)
         if(! callBack(array[i]))
             newArray.push(array[i]);
     return newArray;
 };
 
 Array.GetPropertyValues = function (array, propName)
 {
     var propValues = [];
     if ($.isArray(array))
         for (var i = 0; i < array.length; i++)
             propValues.push(array[i][propName]);
     else
         for (var i in array)
             propValues.push(array[i][propName]);
     return propValues;
 };
 
 Array.ObjFieldSum = function (arr, field)
 {
     return arr.reduce(function(acc, obj){ return acc + parseFloat(obj[field]);} , 0);
 }
 
 var __unsavedChangesTracker = null;
 var __stopUnsavedTracking = false;
 function UnsavedTracker(parentSelector)
 {
     this.Stop = false;
     this.Data = null;
     this.DbModel = typeof DbModelObj == "undefined" ? 0 : 1;
     this.DataFunction = null;
     var inputs = null;
     if (typeof parentSelector == "function")
         this.DataFunction = parentSelector;
     if (!this.DbModel && !this.DataFunction)
     {
         parentSelector = parentSelector || 'body';
         inputs = $(parentSelector).find('INPUT[type="text"],SELECT,TEXTAREA');
     }
     __unsavedChangesTracker = this;
     // Sayfa yüklendikten biraz sonra değerleri alıyoruz
     setTimeout('__unsavedChangesTracker.setInitialValues();', 750);
     this.setInitialValues = function () {
         if (this.DataFunction)
             this.Data = this.DataFunction();
         else if (this.DbModel)
             this.Data = DbModelForm_Save(DbModel_CustomSaveFunc, true);
         else
             for (var i = 0; i < inputs.length; i++)
                 inputs.eq(i).attr('initial_data', inputs.eq(i).val());
     };
     this.getChanged = function () {
         if (this.DbModel || this.DataFunction)
         {
             var o1 = this.Data;
             var o2 = null;
             if (this.DataFunction)
                 o2 = this.DataFunction();
             else
                 o2 = DbModelForm_Save(DbModel_CustomSaveFunc, true);
             if (JSON.stringify(o1) != JSON.stringify(o2))
                 return true;
         } else
             for (var i = 0; i < inputs.length; i++)
                 if (inputs.eq(i).val() != inputs.eq(i).attr('initial_data'))
                     return true;
         return false;
     };
 
     window.onbeforeunload = function (e) {
         var obj = __unsavedChangesTracker;
         if (obj.Stop || !obj.getChanged() || __stopUnsavedTracking)
             return;
         if (!e)
             e = window.event;
         e.returnValue = COMMONLANG.WINDOW_CLOSE_CONFIRMATION;
     };
 }
 
 jQuery.expr[':'].Contains = function (a, i, m) {
     var a = jQuery(a).text().replace(/İ|ı/gi, 'I').toUpperCase();
     var b = m[3].replace(/İ|ı/gi, 'I').toUpperCase();
     return a.indexOf(b) >= 0;
 };
 // Bootstrap temasında üretilen button'ları
 // .button() fonksiyonuyla çağrıldığında çıkacak
 // hataları engellemek için
 var oldButtonFunc = jQuery.fn.button;
 jQuery.fn.button = function(){
     if ((USE_BS_UI || USE_BS_UI_4) &&
         ! $(this).hasClass('ui-button') &&
         typeof arguments[0] == "string" &&
         arguments[0].match(/(disable|enable)/))
     {
         if (arguments[0] == 'disable')
             $(this).attr('disabled', 'disabled')
         else
             $(this).removeAttr('disabled');
         return $(this);
     }
     return oldButtonFunc.apply(this, arguments);
 };
 function EmptyValSel(selector)
 {
     if (parseInt($.fn.jquery) >= 2)
         selector = selector.replace(/\=\]/g, '=""]');
     return selector;
 }
 
 function copyToClipboard(text)
 {
     if (window.clipboardData && window.clipboardData.setData) {
         // IE specific code path to prevent textarea being shown while dialog is visible.
         return clipboardData.setData("Text", text);
     } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
         var textarea = document.createElement("textarea");
         textarea.textContent = text;
         textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in MS Edge.
         document.body.appendChild(textarea);
         textarea.select();
         try {
             return document.execCommand("copy");  // Security exception may be thrown by some browsers.
         } catch (ex) {
             console.warn("Copy to clipboard failed.", ex);
             return false;
         } finally {
             document.body.removeChild(textarea);
         }
     }
 }
 
 function isLocalHost()
 {
     return window.location.host.match(/^localhost/)
             || window.location.host.match(/^127.0.0.1/);
 }
 
 function PinEvent()
 {
     $('.tbl-query').find('TD.cr-pin')
         .unbind("click")
         .click(function(){
             var obj = $(this);
             if (obj.hasClass('pinned'))
                 obj.removeClass('pinned');
             else
                 obj.addClass('pinned');
     });
 
     $('.tbl-query .cr-op [editable_list=1]').change(function(){
         var v = $(this).val();
         $(this).closest('TR')
             .find('.td_criteron .second_input')
             .toggle(v == 'BETWEEN')
             .find('INPUT,SELECT')
             .attr('gorunur', v == 'BETWEEN' ? 1 : 0);
     });
 }
 
 function IsMobileBrowser()
 {
   var check = false;
   (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
   return check;
 }
 
 function IsMobileOrTabletBrowser()
 {
   var check = false;
   (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
   return check;
 }
 
 function IsBrowserSafari()
 {
     return (navigator.userAgent.match(/(iPhone|iPad).*Safari/i) && ! navigator.userAgent.match(/CriOS/i));
 }
 
 jQuery.fn.value = function(){
     var arg = arguments;
     if (arg.length == 0)
     {
         var val = Form.GetValue(this);
         if ($(this).attr('var_type') == 'money')
         {
             val = parseFloat(val);
             if (isNaN(val))
                 val = 0;
         }
         return val;
     }
     return Form.SetValue(this, arg[0]);
 };
 
 (function(old) {
   $.fn.attr = function() {
     if(arguments.length === 0) {
       if(this.length === 0) {
         return null;
       }
 
       var obj = {};
       $.each(this[0].attributes, function() {
         if(this.specified) {
           obj[this.name] = this.value;
         }
       });
       return obj;
     }
 
     return old.apply(this, arguments);
   };
 })($.fn.attr);