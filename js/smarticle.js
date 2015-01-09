/* Smarticle v0.01 */
(function($){
    $.fn.smarticle = function(options) {
        var elements = this;

        if(elements.length > 0) {
            var opts = $.extend({}, $.fn.smarticle.defaults, options);

            elements.each(function(){
                var self = this;
                var $self = $(self);

                var $existingSmartifacts = $self.find('.smarticle-layout .smartifact');
                var $smartifactTools = $self.find('.smarticle-tools .smartifact');
                var $smartifactLayout = $self.find('.smarticle-layout');
                var $placeholder = $('<div class="smartifact-wrapper"><div class="smartifact-placeholder"></div></div>');

                // Tools Events
                $smartifactTools.attr('draggable','true').on('dragstart', function(e){
                    e.originalEvent.dataTransfer.setData('smartifact', $(this).data('smartifact'));
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

                // TEMP
                $smartifactLayout.on('drop', function(e){
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

                    $newSmartifact = $('<div class="smartifact-wrapper"><div class="smartifact">' + smartifactContent + '</div></div>');
                    $newSmartifact.data('smartifact', smartifactType);
                    $placeholder.replaceWith($newSmartifact);
                });

                // Existing Layout Smartifact Events - WIP
                // $existingSmartifacts.attr('draggable','true').on('dragstart', function(e){
                //     e.originalEvent.dataTransfer.setData('smartifact', $(this).data('smartifact'));
                //     $(this).css('opacity', '0.5');
                //     $(this).hide();
                //     $(this).append($placeholder);
                // }).on('dragend', function(){
                //     $(this).css('opacity', '1');
                //     $placeholder.remove();
                //     $(this).show();
                // });

            });

        }

        return this;
    }
    $.fn.smarticle.defaults = {

    };
})(jQuery);
