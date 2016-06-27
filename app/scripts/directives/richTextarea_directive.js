'use strict';

angular.module('scalearAngularApp')
.directive('richTextarea', function() {
    return {
      replace: true,
      restrict: 'EA',
      template: "<textarea medium-editor bind-options='medium_editor_options' class='medium-editor-textarea' ></textarea>",
      controller: ['$scope', '$attrs', '$interpolate', function($scope, $attrs, $interpolate) {

        // Medium Editor - Spectrum text color extension
        console.log("controller", $scope)
        var currentTextSelection;

        var ColorPickerExtension = MediumEditor.extensions.button.extend({
          name: "colorPicker",
          action: "applyForeColor",
          aria: "color picker",
          contentDefault: "<span class='editor-color-picker'>Color<span>",

          init: function() {
            this.button = this.document.createElement('button');
            this.button.classList.add('medium-editor-action');
            this.button.innerHTML = '<b>color</b>';
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
          contentDefault: '+', // ±
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
              this.execAction('fontSize', { value: parseInt(fontSize)+1 } || 3);
          }
        })
        //////////////////////////////////////////////////////////////////////////////

        // Medium Editor - Font decrease extension
        var FontSizeDecreaseExtension = MediumEditor.extensions.button.extend({
          name: 'decreaseFontSize',
          action: 'fontSize',
          aria: 'decrease font size',
          contentDefault: '-', // ±
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
              this.execAction('fontSize', { value: parseInt(fontSize)-1 } || 3);
          }
        })
        //////////////////////////////////////////////////////////////////////////////

        $scope.medium_editor_options = {
          'toolbar': {
            'buttons': ["bold", "italic", "underline", "strikethrough", "subscript", "superscript",
            {name: 'anchor',contentDefault:"<i class='fi-link size-18'></i>"},
            "anchor",
            {name: 'image',contentDefault:"<i class='fi-photo size-18'></i>"},
            "quote","increaseFontSize","decreaseFontSize", "colorPicker", "pre",
            {name: 'orderedlist',contentDefault:"<i class='fi-list-number size-24' style='line-height:0'></i>"},
             {name: 'unorderedlist',contentDefault:"<i class='fi-list-bullet size-24' style='line-height:0'></i>"},
             "justifyLeft", "justifyCenter", "justifyRight",
             {name: 'removeFormat',contentDefault:"<b>clear</b>"},
             ]
          },
          'placeholder': (!$attrs.placeholder) ? false : { text: $interpolate($attrs.placeholder)() },
          extensions: {
            'colorPicker': pickerExtension,
            'increaseFontSize':new FontSizeIncreseExtension(),
            'decreaseFontSize':new FontSizeDecreaseExtension()
          },
          disableReturn:false
        }

      }]
    };
  })
