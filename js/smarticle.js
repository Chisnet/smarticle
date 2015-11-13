/* Smarticle v0.01 */
(function($){
    $.fn.smarticle = function(smartifacts, options) {
        var elements = this;
        var $moving_element;
        var id_counter = 0;
        var preview_timeout = 0;

        function get_id() {
            id_counter += 1;
            return 'smartifact_field_' + id_counter;
        }

        function slugify(str) {
            var sane_str = str.replace(/[^A-Za-z0-9\s]/g, '').replace(/\s/g,'_');
            sane_str = sane_str.replace(/^_+/g, '').replace(/_+$/g, '').replace(/_+/g, '_');
            return sane_str.toLowerCase();
        }

        function render_preview() {
            var $preview_area = $('#preview_area');
            var output = '';
            var $smartifacts = $('.smarticle-layout .smartifact');
            for(var i=0; i<$smartifacts.length; i++){
                var $smartifact = $($smartifacts[i]);
                var smartifact_type = $smartifact.data('type');
                var $fields = $smartifact.find('input, textarea, select');
                var field_data = {};
                for(var j=0; j<$fields.length; j++){
                    var $field = $($fields[j]);
                    var field_name = $field.data('name');
                    field_data[field_name] = $field.val();
                }
                //var output = smartifacts[smartifact_type]['parse']
                output += smartifacts[smartifact_type]['parse'](field_data);
            }
            $preview_area.html(output);
        }

        if(elements.length > 0) {
            var opts = $.extend({}, $.fn.smarticle.defaults, options);
            var $placeholder = $('<div class="smartifact-wrapper"><div class="smartifact-placeholder"></div></div>');

            var dragstart_func = function(e){
                if(e.originalEvent.explicitOriginalTarget.localName == 'h2' || e.originalEvent.explicitOriginalTarget.parentElement.localName == 'h2') { 
                    $moving_element = $(this).parent();
                    e.originalEvent.dataTransfer.setData('origin', 'existing');
                    $(this).css('opacity', '0.5');
                    $placeholder.find('.smartifact-placeholder').css('height', $(this).parent().innerHeight());
                    $(this).parent().parent().hide();
                    $(this).append($placeholder);
                }
            };

            var dragend_func = function(){
                $moving_element = undefined;
                $(this).css('opacity', '1');
                $(this).parent().parent().show();
                $placeholder.find('.smartifact-placeholder').css('height', '');
                $placeholder.remove();
            };

            elements.each(function(){
                var self = this;
                var $self = $(self);

                var $existingSmartifacts = $self.find('.smarticle-layout .smartifact h2');
                var $smartifactTools = $self.find('.smarticle-tools .smartifact');
                var $smartifactLayout = $self.find('.smarticle-layout');

                // Tools Events
                $smartifactTools.attr('draggable','true').on('dragstart', function(e){
                    e.originalEvent.dataTransfer.setData('smartifact', $(this).data('smartifact'));
                    e.originalEvent.dataTransfer.setData('origin', 'new');
                    $(this).css('opacity', '0.5');
                    $smartifactLayout.append($placeholder);
                }).on('dragend', function(){
                    $(this).css('opacity', '1');
                    $placeholder.remove();
                });

                // Layout Events
                $smartifactLayout.on('dragover', function(e){
                    if(e.preventDefault) {
                        e.preventDefault();
                    }
                    return false;
                }).on('dragenter', function(e){
                    var $originalElement = $(e.originalEvent.target);
                    if($originalElement.hasClass('smartifact')) {
                        $originalElement.parent().before($placeholder);
                    }
                    else if($originalElement[0] == $smartifactLayout[0]) {
                        $smartifactLayout.append($placeholder);
                    }
                });

                $smartifactLayout.on('drop', function(e){
                    var smartifactOrigin = e.originalEvent.dataTransfer.getData('origin');

                    if(smartifactOrigin == 'new') {
                        var smartifactType = e.originalEvent.dataTransfer.getData('smartifact');
                        var smartifactContent = '';
                        
                        var smartifactInfo = smartifacts[smartifactType];
                        var fields = smartifactInfo['fields'];

                        smartifactContent += '<h2>' + smartifactInfo['name'] + '</h2>';
                        smartifactContent += '<a href="#" class="remove">X</a>';
                        for(var i=0; i<fields.length; i++) {
                            var field = fields[i];
                            var field_output = '<div class="field ' + field['type'] + '_field">';
                            var field_id = get_id();
                            switch(field['type']){
                                case 'text':
                                    field_output += '<label for="' + field_id + '">' + field['name'] + '</label>';
                                    field_output += '<input id="' + field_id + '" type="text" data-name="' + slugify(field['name']) + '" data-type="' + field['type'] + '"/>';
                                    break;
                                case 'markdown':
                                    field_output += '<label for="' + field_id + '">' + field['name'] + '</label>';
                                    field_output += '<textarea id="' + field_id + '" data-name="' + slugify(field['name']) + '" data-type="' + field['type'] + '"></textarea>';
                                    field_output += '<div class="help">Markdown syntax is supported!</div>';
                                    break;
                                case 'dropdown':
                                    field_output += '<label for="' + field_id + '">' + field['name'] + '</label>';
                                    field_output += '<select id="' + field_id + '" data-name="' + slugify(field['name']) + '" data-type="' + field['type'] + '">';
                                    for(var j=0; j<field['options'].length; j++) {
                                        var option = field['options'][j];
                                        field_output += '<option value="' + slugify(option) + '">' + option + '</option>';
                                    }
                                    field_output += '</select>';
                                    break;
                            }
                            field_output += '</div>';
                            smartifactContent += field_output;
                        }

                        var $newSmartifact = $('<div class="smartifact-wrapper"><div class="smartifact" data-type="' + slugify(smartifactInfo['name']) + '">' + smartifactContent + '</div></div>');
                        $newSmartifact.data('smartifact', smartifactType);
                        $newSmartifact.find('.smartifact h2').attr('draggable','true').on('dragstart', dragstart_func).on('dragend', dragend_func);
                        
                        $newSmartifact.find('input, select, textarea').bind('change', function(){
                            render_preview();
                        });

                        $placeholder.replaceWith($newSmartifact);

                        render_preview();
                    }
                    else if(smartifactOrigin == 'existing') {
                        $placeholder.replaceWith($moving_element.parent());
                        render_preview();
                    }
                });

                // Existing Layout Smartifact Events - WIP
                $existingSmartifacts.attr('draggable','true').on('dragstart', dragstart_func).on('dragend', dragend_func);

                $('.smarticle-layout .smartifact');
            });

        }

        return this;
    }
    $.fn.smarticle.defaults = {

    };
})(jQuery);
