/* Smarticle v0.01 */
(function($){
    $.fn.smarticle = function(options) {
        var elements = this;
        var $moving_element;

        if(elements.length > 0) {
            var opts = $.extend({}, $.fn.smarticle.defaults, options);
            var $placeholder = $('<div class="smartifact-wrapper"><div class="smartifact-placeholder"></div></div>');

            var dragstart_func = function(e){
                $moving_element = $(this).parent();
                e.originalEvent.dataTransfer.setData('origin', 'existing');
                $(this).css('opacity', '0.5');
                $(this).parent().hide();
                $placeholder.find('.smartifact-placeholder').css('height', $(this).innerHeight());
                $(this).append($placeholder);
            };

            var dragend_func = function(){
                $moving_element = undefined;
                $(this).css('opacity', '1');
                $placeholder.find('.smartifact-placeholder').css('height', '');
                $placeholder.remove();
                $(this).parent().show();
            };

            elements.each(function(){
                var self = this;
                var $self = $(self);

                var $existingSmartifacts = $self.find('.smarticle-layout .smartifact');
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
                        var smartifactContent = 'Unknown';
                        switch(smartifactType) {
                            case 'header':
                                smartifactContent = 'Header';
                                break;
                            case 'text':
                                smartifactContent = 'Text';
                                break;
                            case 'quote':
                                smartifactContent = 'Quote';
                                break;
                            case 'youtube':
                                smartifactContent = 'YouTube Video';
                                break;
                        }
                        var $newSmartifact = $('<div class="smartifact-wrapper"><div class="smartifact">' + smartifactContent + '</div></div>');
                        $newSmartifact.data('smartifact', smartifactType);
                        $newSmartifact.find('.smartifact').attr('draggable','true').on('dragstart', dragstart_func).on('dragend', dragend_func);
                        $placeholder.replaceWith($newSmartifact);
                    }
                    else if(smartifactOrigin == 'existing') {
                        $placeholder.replaceWith($moving_element);
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
