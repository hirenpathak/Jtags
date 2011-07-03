$.fn.tags = function(options){
	var origin_element = this;
	
	options = options || {};
	options.separator = options.separator || ',';
	options.add = options.add || function(){ };
	options.remove = options.remove || function(){ console.log('remove'); };
	
	var o = {
		e: null,
		ed: null,
		tags:[],
		sep: options.separator,
		addCallBack: options.add,
		removeCallBack: options.remove,
		
		init:function(){
			this.e = origin_element;
			var that = this;

			var n = $(this.e).next();
			if ( /jq_tags_editor/.test(n.attr('class')) ){	
				this.ed = n.get(0);
			}			
			else{
				$(this.e).after('<div class="jq_tags_editor"><span class="jq_tags_tokens"></span><input type="text" class="jq_tags_editor_input" /></div>');
				this.ed = $(this.e).next();
			}

			$(this.e).hide();
			$(this.ed)
				.unbind()
				.click(function(){
					$(that.ed).find('input').focus();
				})
				.find('input')
					.unbind()
					.blur(function(){
						that.add_tag();
					})
					.keypress(function(e){
						switch(e.which){
							case 13:	// Return is pressed
							case that.sep.charCodeAt(0): // separator is pressed
								e.preventDefault();
								that.add_tag();
								break;
						}
					});

			r = $(this.e).val().split( this.sep );
			this.tags = []
			for(i in r){				
				r[i] = r[i].replace( new RegExp('["' + this.sep + ' ]', 'gi'), '');
				if(r[i] != ''){	
					this.tags.push(r[i]);	
				}
			}
			this.refresh_list();			
		},
		
		add_tag:function(){
			var tag_txt = $(this.ed).find('input')
				.val().replace( new RegExp('["' + this.sep + ' ]', 'gi'), '');
			
			if( (tag_txt != '') && (jQuery.inArray(tag_txt, this.tags) < 0) ){
				this.tags.push(tag_txt);
				this.refresh_list();
			}
			$(this.ed).find('input').val('');
			this.addCallBack(tag_txt, this);
		},		
		remove_tag:function(tag_txt){
			r = [];
			for(i in this.tags){
				if(this.tags[i] != tag_txt){	
					r.push(this.tags[i]);	
				}
			}
			this.tags = r;
			this.refresh_list();
			this.removeCallBack(tag_txt, this);
		},		
		refresh_list: function(){
			var that = this;
			
			$(this.ed).find('span.jq_tags_tokens').html('');
			$(this.e).val(this.tags.join(this.sep + ' '));
			
			h = '';
			for(i in that.tags){
				h += '<div class="jq_tags_token">' + that.tags[i] + '<a href="#">x</a></div>';
			}
			$(that.ed).find('input').val('');
			$(that.ed)
				.find('span.jq_tags_tokens')
					.html(h)
					.find('div.jq_tags_token')
						.find('a')
							.click(function(){
								var tag_txt = $(this).parents('.jq_tags_token:first').html().replace(/<a(.*?)<\/a>/i, ''); 
								that.remove_tag(tag_txt);
							});
		}
		
	};
	o.init();
	
	
	
};