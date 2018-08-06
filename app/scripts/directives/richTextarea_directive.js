'use strict';

angular.module('scalearAngularApp')
  .directive('richTextarea', ['$timeout', function($timeout) {
    return {
      replace: true,
      restrict: 'EA',
      template: "<textarea medium-editor bind-options='medium_editor_options' class='medium-editor-textarea' ></textarea>",
      controller: ['$scope', '$attrs', '$element','$interpolate', function($scope, $attrs, $element, $interpolate) {

        // Medium Editor - Spectrum text color extension
        var currentTextSelection;
        var ColorPickerExtension = MediumEditor.extensions.button.extend({
          name: "colorPicker",
          action: "applyForeColor",
          aria: "color picker",
          contentDefault: "<span class='editor-color-picker'>Color<span>",

          init: function() {
            this.button = this.document.createElement('button');
            this.button.classList.add('medium-editor-action');
            this.button.innerHTML = "<i class='fi-paint-bucket size-18'></i>";
            initPicker(this.button);
            this.on(this.button, 'click', this.handleClick.bind(this));
          },
          handleClick: function(event) {
            currentTextSelection = this.base.exportSelection();
            var currentTextColor = $(this.base.getSelectedParentElement()).css('color');
            $(this.button).spectrum("set", currentTextColor);
            event.preventDefault();
            event.stopPropagation();
            var action = this.getAction();
            if(action) {
              this.execAction(action);
            }
          }
        });

        var pickerExtension = new ColorPickerExtension();

        function setColor(color) {
          var finalColor = color ? color.toRgbString() : 'rgba(0,0,0,0)';

          pickerExtension.base.importSelection(currentTextSelection);
          pickerExtension.document.execCommand("styleWithCSS", false, true);
          pickerExtension.document.execCommand("foreColor", false, finalColor);
        }

        function initPicker(element) {
          $(element).spectrum({
            allowEmpty: true,
            color: "#f00",
            showInput: true,
            showAlpha: true,
            showPalette: true,
            showInitial: true,
            hideAfterPaletteSelect: true,
            preferredFormat: "hex3",
            change: function(color) {
              setColor(color);
            },
            hide: function(color) {
              setColor(color);
            },
            palette: [
              ["#000", "#444", "#666", "#999", "#ccc", "#eee", "#f3f3f3", "#fff"],
              ["#f00", "#f90", "#ff0", "#0f0", "#0ff", "#00f", "#90f", "#f0f"],
              ["#f4cccc", "#fce5cd", "#fff2cc", "#d9ead3", "#d0e0e3", "#cfe2f3", "#d9d2e9", "#ead1dc"],
              ["#ea9999", "#f9cb9c", "#ffe599", "#b6d7a8", "#a2c4c9", "#9fc5e8", "#b4a7d6", "#d5a6bd"],
              ["#e06666", "#f6b26b", "#ffd966", "#93c47d", "#76a5af", "#6fa8dc", "#8e7cc3", "#c27ba0"],
              ["#c00", "#e69138", "#f1c232", "#6aa84f", "#45818e", "#3d85c6", "#674ea7", "#a64d79"],
              ["#900", "#b45f06", "#bf9000", "#38761d", "#134f5c", "#0b5394", "#351c75", "#741b47"],
              ["#600", "#783f04", "#7f6000", "#274e13", "#0c343d", "#073763", "#20124d", "#4c1130"]
            ]
          });
        }
        //////////////////////////////////////////////////////////////////////////////

        // Medium Editor - Font increase extension
        var FontSizeIncreseExtension = MediumEditor.extensions.button.extend({
            name: 'increaseFontSize',
            action: 'fontSize',
            aria: 'increase font size',
            contentDefault: '+',
            init: function() {
              this.button = this.document.createElement('button');
              this.button.classList.add('medium-editor-action');
              this.button.innerHTML = '<b title="increase text size">+</b>';
              this.on(this.button, 'click', this.handleClick.bind(this));
            },
            handleClick: function(event) {
              event.preventDefault();
              event.stopPropagation();
              var fontSize = this.document.queryCommandValue('fontSize') + '';
              if(fontSize < 8)
                this.execAction('fontSize', { value: parseInt(fontSize) + 1 } || 3);
            }
          })
          //////////////////////////////////////////////////////////////////////////////

        // Medium Editor - Font decrease extension
        var FontSizeDecreaseExtension = MediumEditor.extensions.button.extend({
            name: 'decreaseFontSize',
            action: 'fontSize',
            aria: 'decrease font size',
            contentDefault: '-',
            init: function() {
              this.button = this.document.createElement('button');
              this.button.classList.add('medium-editor-action');
              this.button.innerHTML = '<b title="decrease text size">-</b>';
              this.on(this.button, 'click', this.handleClick.bind(this));
            },
            handleClick: function(event) {
              event.preventDefault();
              event.stopPropagation();
              var fontSize = this.document.queryCommandValue('fontSize') + '';
              if(fontSize > 1)
                this.execAction('fontSize', { value: parseInt(fontSize) - 1 } || 3);
            }
          })
          //////////////////////////////////////////////////////////////////////////////

        // Medium Editor - Font decrease extension
        var MathJaxExtension = MediumEditor.extensions.button.extend({
          name: 'mathjax',
          aria: 'Math Latex support',
          contentDefault: 'Math',
          init: function() {
            this.button = this.document.createElement('button');
            this.button.classList.add('medium-editor-action');
            this.button.classList.add('mathjax-btn');
            this.button.title = "Use this button to turn on/off equation formatting. Write equations using LaTeX formatting surrounded by $$ (new line) or $ (in-line). For example: $$E=mc^2$$"
            this.button.innerHTML = '<b title="Math Latex">&#8721;</b>';
            this.on(this.button, 'click', this.handleClick.bind(this));
            var self = this
            var editor_element = this.base.elements[0]
            $timeout(function() {
              MathJaxCleanUp(editor_element)
              MathJax.Hub.Queue(["Rerender", MathJax.Hub, editor_element,function(){
                disableMathEdit(editor_element)
                self.setActive()
              }])
            })
          },
          handleClick: function(event) {
            var self = this
            var editor_element = this.base.elements[0]
            if(this.isActive()) {
              removeTypeset(editor_element)
              self.setInactive()
            } else {
              MathJax.Hub.Queue(["Typeset", MathJax.Hub, editor_element,function(){
                disableMathEdit(editor_element)
                self.setActive()
                $(".mathjax-btn").tooltip((!self.isActive())? "show" : "destroy");
              }])
            }
            event.preventDefault();
            event.stopPropagation();
            this.base.trigger("editableInput",{},editor_element)
          },
          isActive: function() {
            var activeClass = this.base.options['activeButtonClass']
            return this.button.classList.contains(activeClass);
          },
          setInactive: function() {
            if(MathJax.Hub.getAllJax(this.base.elements[0]).length == 0) {
              var activeClass = this.base.options['activeButtonClass']
              this.button.classList.remove(activeClass);
            }
          },
          setActive: function() {
            if(MathJax.Hub.getAllJax(this.base.elements[0]).length > 0) {
              var activeClass = this.base.options['activeButtonClass']
              this.button.classList.add(activeClass);
            }
          },
        })

        function removeTypeset(elem) {
          var HTML = MathJax.HTML,
            jax = MathJax.Hub.getAllJax();
          for(var i = 0, m = jax.length; i < m; i++) {
            var script = jax[i].SourceElement()

            var splitter = (script.type.indexOf("mode=display") == -1)? "$" : "$$"
             var tex = splitter + jax[i].originalText + splitter
            jax[i].Remove();
            var preview = script.previousSibling;
            var parent = script.parentNode
            var span = HTML.Element("span", { className: "mathjax_original" }, [tex]);
            parent.insertBefore(span, preview);
            if(preview && preview.className === "MathJax_Preview")
              parent.removeChild(preview);
            parent.removeChild(script);
            $(span).replaceWith(function() {
              return $(this).text()
            });
          }
        }

        function disableMathEdit(elem) {
          var jax = MathJax.Hub.getAllJax(elem);

          for(var i = 0; i < jax.length; i++) {
            var el = $("<span contenteditable='false'></span>").css({ width: "100%", height: "100%", background: "rgba(0, 0, 0, 0)", position: "absolute" })
            $("#" + jax[i].inputID + "-Frame").css("outline", "none").prepend(el)
          }
        }

        function MathJaxCleanUp(elem) {
          $(elem).find("span[class*=MathJax]").remove()
        }
        //////////////////////button image size 1///////////////////////////
        var ImageSizeOneExtension = MediumEditor.extensions.button.extend({
          name: 'size_1',
          aria: 'Image size 32x32',

          init: function() {
            this.button = this.document.createElement('button');
            this.button.classList.add('medium-editor-action');
            this.button.title = "Use this button to make the inserted image size 32X32"
            this.button.innerHTML = '<b title="Size 1">size 1</b>';
            this.on(this.button, 'click', this.handleClick.bind(this));
            //console.log(this)
            // var self = this
            // var editor_element = this.base.elements[0]

          },
          handleClick: function(event) {
            //this.base.options.contentWindow.getSelection().baseNode.removeAttribute("data-medium-editor-element")
            var selectedImage =this.base.options.contentWindow.getSelection().baseNode.children[0]
            this.base.removeElements(selectedImage)
            selectedImage.setAttribute('class','size_1')
            this.base.options.contentWindow.getSelection().baseNode.innerHTML = selectedImage.outerHTML


            var basic_editor = MediumEditor.getEditorFromElement(document.getElementsByClassName('medium-editor-textarea')[2])
            var all = basic_editor.getContent()
            //console.log(all)

            basic_editor.resetContent(this.base.elements[0])
            //document.getElementsByClassName('medium-editor-textarea')[2].firstElementChild.remove()
            basic_editor.setContent(all,0)


            this.base.destroy()
          },
          isActive: function() {
            var activeClass = this.base.options['activeButtonClass']
            return this.button.classList.contains(activeClass);
          },
          setInactive: function() {

              var activeClass = this.base.options['activeButtonClass']
              this.button.classList.remove(activeClass);

          },
          setActive: function() {

              var activeClass = this.base.options['activeButtonClass']
              this.button.classList.add(activeClass);

          }
        })

        //////////////////////button image size 2///////////////////////////
        var ImageSizeTwoExtension = MediumEditor.extensions.button.extend({
          name: 'size_2',
          aria: 'Image size 64x64',

          init: function() {
            this.button = this.document.createElement('button');
            this.button.classList.add('medium-editor-action');
            this.button.title = "Use this button to make the inserted image size 64x64"
            this.button.innerHTML = '<b title="Size 1">size 2</b>';
            this.on(this.button, 'click', this.handleClick.bind(this));
            // var self = this
            // var editor_element = this.base.elements[0]

          },
          handleClick: function(event) {
            this.base.options.contentWindow.getSelection().baseNode.removeAttribute("data-medium-editor-element")
            var selectedImage =this.base.options.contentWindow.getSelection().baseNode.children[0]
            selectedImage.setAttribute('class','size_2')
            selectedImage.blur()
            this.base.destroy()
          },
          isActive: function() {
            var activeClass = this.base.options['activeButtonClass']
            return this.button.classList.contains(activeClass);
          },
          setInactive: function() {

              var activeClass = this.base.options['activeButtonClass']
              this.button.classList.remove(activeClass);

          },
          setActive: function() {

              var activeClass = this.base.options['activeButtonClass']
              this.button.classList.add(activeClass);

          }
        })
        //////////////////////button image size 3///////////////////////////
        var ImageSizeThreeExtension = MediumEditor.extensions.button.extend({
          name: 'size_3',
          aria: 'Image size 128x128',

          init: function() {
            this.button = this.document.createElement('button');
            this.button.classList.add('medium-editor-action');
            this.button.title = "Use this button to make the inserted image size 128x128"
            this.button.innerHTML = '<b title="Size 1">size 3</b>';
            this.on(this.button, 'click', this.handleClick.bind(this));
            // var self = this
            // var editor_element = this.base.elements[0]

          },
          handleClick: function(event) {
            this.base.options.contentWindow.getSelection().baseNode.removeAttribute("data-medium-editor-element")
            var selectedImage =this.base.options.contentWindow.getSelection().baseNode.children[0]
            selectedImage.setAttribute('class','size_3')

            selectedImage.blur()
            this.base.destroy()
          },
          isActive: function() {
            var activeClass = this.base.options['activeButtonClass']
            return this.button.classList.contains(activeClass);
          },
          setInactive: function() {

              var activeClass = this.base.options['activeButtonClass']
              this.button.classList.remove(activeClass);

          },
          setActive: function() {

              var activeClass = this.base.options['activeButtonClass']
              this.button.classList.add(activeClass);

          }
        })
        //////////////////////button image size 4///////////////////////////
        var ImageSizeFourExtension = MediumEditor.extensions.button.extend({
          name: 'size_4',
          aria: 'Image size 256x256',

          init: function() {
            this.button = this.document.createElement('button');
            this.button.classList.add('medium-editor-action');
            this.button.title = "Use this button to make the inserted image size 256x256"
            this.button.innerHTML = '<b title="Size 1">size 4</b>';
            this.on(this.button, 'click', this.handleClick.bind(this));
            // var self = this
            // var editor_element = this.base.elements[0]

          },
          handleClick: function(event) {
            this.base.options.contentWindow.getSelection().baseNode.removeAttribute("data-medium-editor-element")
            var selectedImage =this.base.options.contentWindow.getSelection().baseNode.children[0]
            selectedImage.setAttribute('class','size_4')

            selectedImage.blur()
            this.base.destroy()
          },
          isActive: function() {
            var activeClass = this.base.options['activeButtonClass']
            return this.button.classList.contains(activeClass);
          },
          setInactive: function() {

              var activeClass = this.base.options['activeButtonClass']
              this.button.classList.remove(activeClass);

          },
          setActive: function() {

              var activeClass = this.base.options['activeButtonClass']
              this.button.classList.add(activeClass);

          }
        })
        //////////////////////////////////////////////////////////////////////////////
        var PictureExtension = MediumEditor.extensions.button.extend({
          name: 'picture',
          tagNames:'<img>',
          aria: 'picture support',
          contentDefault: 'Picture',
          init: function() {
            var mediumEditor = this.base
            var editor     = this.base.elements[0]

            this.base.subscribe("editableClick", function(event, editor){
              if(event.target.tagName === 'IMG'){
                mediumEditor.selectElement(event.target.parentNode)

              }
            })
            this.button = this.document.createElement('button');
            this.button.classList.add('medium-editor-action');
            this.button.innerHTML = "<i class='fi-photo'><i>";
            this.on(this.button, 'click', this.handleClick.bind(this));


          },
          handleClick: function(event) {
            var src
            var mediumEditor   = this.base
            var editor_element = this.base.elements[0]

            if(this.isActive()) {
              var insertedImage = document.querySelector("div.medium-editor-textarea p img#insertedImage")
              insertedImage.parentNode.removeAttribute("data-medium-editor-element")
              
              var selectedImage  = mediumEditor.options.contentWindow.getSelection().baseNode.children[0]
              this.setInactive()
              src = selectedImage.getAttribute("src")

              mediumEditor.options.contentWindow.getSelection().baseNode.innerHTML = src//"<p class='medium-editor-p' >"+ src +"<p>"
              console.log("mediumEditor.options.contentWindow.getSelection() :",mediumEditor.options.contentWindow.getSelection() )
              //mediumEditor.selectElement(this.base.options.contentWindow.getSelection().baseNode.children[0].parentNode)

              this.removeSize()

              var all = this.base.getContent()
              console.log("all:",all)
              this.base.resetContent(this.base.elements[0])
              this.base.setContent(all,0)


              var toolbar = mediumEditor.getExtensionByName('toolbar');
              toolbar.hideToolbar()
              toolbar.hideToolbarDefaultActions()
            } else {
              this.setActive()
              var src = this.base.options.contentWindow.getSelection().toString().trim();
              //this.base.options.ownerDocument.execCommand('insertImage', false, src);

              var selectedLine = this.base.options.contentWindow.getSelection().baseNode.parentNode
              console.log("this.base.options.contentWindow.getSelection().baseNode",this.base.options.contentWindow.getSelection().baseNode)

              selectedLine.innerHTML = "<img class='medium-editor-element' id='insertedImage' src="+src+">"
              var transformedImage = selectedLine

              var toolbar = mediumEditor.getExtensionByName('toolbar');
             toolbar.hideToolbar()
             toolbar.hideToolbarDefaultActions()

              var editor = new MediumEditor(transformedImage, {
                  toolbar:{
                    buttons:['size_1','size_2','size_3','size_4']
                  },
                  extensions:{
                    size_1: new ImageSizeOneExtension(),
                    size_2: new ImageSizeTwoExtension(),
                    size_3: new ImageSizeThreeExtension(),
                    size_4: new ImageSizeFourExtension()
                  }
              });

              editor.selectElement(transformedImage)
              editor.subscribe('hideToolbar',function(){
                editor.destroy()
              })
              editor.getExtensionByName('toolbar').getToolbarElement().style.width = 'auto'

              var all = this.base.getContent()
              console.log("all:",all)
              this.base.resetContent(this.base.elements[0])

              this.base.setContent(all,0)
              var insertedImage = document.querySelector("div.medium-editor-textarea p img#insertedImage")

              insertedImage.parentNode.removeAttribute("data-medium-editor-element")
              console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++")
              console.log(this.base.getContent())




            }
            event.preventDefault();
            event.stopPropagation();
          },
          removeSize: function(){
            var classes = this.base.options.contentWindow.getSelection().baseNode.getAttribute('class')
            if (classes.indexOf('size_1') != -1){
              this.base.options.contentWindow.getSelection().baseNode.classList.remove("size_1");
              console.log("hree")
              console.log(this.base.options.contentWindow.getSelection().baseNode.classList)
            }
            if (classes.indexOf('size_2')!= -1){
              this.base.options.contentWindow.getSelection().baseNode.classList.remove("size_2");
            }
            if (classes.indexOf('size_3')!= -1){
              this.base.options.contentWindow.getSelection().baseNode.classList.remove("size_3");
            }
            if (classes.indexOf('size_4')!= -1){
              this.base.options.contentWindow.getSelection().baseNode.classList.remove("size_4");
            }
          },
          isAlreadyApplied: function(node){

            if(node.tagName === 'IMG'){
              return true
            } else {
              return false
            }
          },
          isActive: function() {
            var activeClass = this.base.options['activeButtonClass']
            return this.button.classList.contains(activeClass);
          },
          setInactive: function() {

              var activeClass = this.base.options['activeButtonClass']
              this.button.classList.remove(activeClass);

          },
          setActive: function() {

              var activeClass = this.base.options['activeButtonClass']
              this.button.classList.add(activeClass);

          }
        })

        ////////////////////////////////////////////////////////////////////

        $scope.medium_editor_options = {
          'toolbar': {
            'buttons': [
              "bold",
              "italic",
              "underline",
              "strikethrough",
              "subscript",
              "superscript",
              "increaseFontSize",
              "decreaseFontSize",
              "colorPicker",
              { name: 'anchor', contentDefault: "<i class='fi-link size-18'></i>" },
              "anchor",
              "quote",
              "pre",
              { name: 'orderedlist', contentDefault: "<i class='fi-list-number size-22' style='line-height:0'></i>" },
              { name: 'unorderedlist', contentDefault: "<i class='fi-list-bullet size-22' style='line-height:0'></i>"},
              "justifyLeft",
              "justifyCenter",
              "justifyRight",
              "mathjax",
              "removeFormat",
              "picture"
            ]
          },
          'placeholder': (!$attrs.placeholder) ? false : { text: $interpolate($attrs.placeholder)() },
          'paste': {
              cleanPastedHTML: true,
              forcePlainText: false
          },
          'extensions': {
            'colorPicker': pickerExtension,
            'increaseFontSize': new FontSizeIncreseExtension(),
            'decreaseFontSize': new FontSizeDecreaseExtension(),
            'mathjax': new MathJaxExtension(),
            'picture': new PictureExtension()
          },
          'disableReturn': false
        }
      }]
    };
  }])
