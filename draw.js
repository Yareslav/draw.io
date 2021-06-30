class DrawIo{
	static canvasCreate(){
		var d=`.all__`;
		var inst={
			back(color){
				ctx.fillStyle=color;
				ctx.fill();
			},
			back2(color){
				ctx2.fillStyle=color;
				ctx2.fill();
			},
			line(color,width=1){
				ctx.strokeStyle=color;
				ctx.lineWidth=width;
			},
			dr(func){
				ctx.beginPath();
				func();
				ctx.closePath();
			},
			setPath(img){
				return `./images/${img}.png`;
			},
			random(a,b) {
				return Math.floor(a+Math.random()*(b+1-a));
			},
		}
		//*canvases
		var canvas=document.querySelector(`${d}drawing`);
		var ctx=canvas.getContext(`2d`);
		canvas.width=$(`.all`).width()-80;
		canvas.height=$(`${d}drawing`).height();
		var canvas2=document.querySelector(`#canvasExample`);
		var ctx2=canvas2.getContext(`2d`);
		canvas2.width=100;
		canvas2.height=100;
		//*canvases
		//!!global
		var mouseIn , removeColor , allowTips=true , canvasColor=`rgba(46, 42, 42,1)` , canvasOpacity=1 , allowClick=true , focused=false;
		//settings
		var src ,   settingsAppear;
		//settings
		//About draw
		var drawColor=`white`;
		var squareRadius=0 , anglesCount;
		var font={
			text:`text`,
			size:20,
			family:`serif`,
			weight:400,
			type:`fillText`
		}
		var brush={
			size:10,
			type:`circle`,
		}
		var color={
			type:`#FFFFFF`
		}
		var line={
			type:`typical`,
			width:1,
			closePath:false,
			fill:false,
			processHasFinished:true,
			mass:[],
			butNumber:0,
			timer:true
		}
		var grad={
			type:`linear`,
			mass:[],
			number:0,
			color:``,
			set:false,
			setGradient(mainCanvas,x1,y1,type){
				var x2 , y2 , Radius;
				if (type==`brush`) {
					if (grad.type==`radial`) {
						Radius=brush.size;
					} else {
							x1-=brush.size;
							y1-=brush.size;
							x2=x1+brush.size*2;
					 		y2=y1+brush.size*2;
					}
				}
				else if (type==`text`) {
					 x2=font.size*(font.text.split(``).length)*0.2645833333333+x1;
					 y2=font.size+y1;
					 if (grad.type==`radial`) {
						Radius=(x2-x1)/2;
						x1=x2-Radius;
						y1=y2-font.size/2;
					}
				}
				else if (type==`line`) {
					var elemMass=[];
					$(`.point`).each(function () {
						elemMass.push([$(this).offset().left-80,$(this).offset().top-100])
					})
					var X , Y;
					 x2=X=elemMass[0][0];
					 y2=Y=elemMass[0][1];
					elemMass.forEach(function (elem) {
						if (x2<elem[0]) x2=elem[0]
						if (y2<elem[1]) y2=elem[1]
						if (X>elem[0]) X=elem[0]
						if (Y>elem[1]) Y=elem[1]
					})
					x1=X;
					y1=Y;
					if (grad.type==`radial`) {
						Radius=(x2-x1)/2;
						x1+=Radius;
						y1+=(y2-y1)/2;
					}
				}
				else {
					if (figure.type!=`star`) {
						if (grad.type==`radial`) Radius=figure.width/2;
						else {
							const hei_=(figure.type==`cutCircle`) ? figure.width :figure.height;
							x1-=figure.width/2;
							y1-=hei_/2;
							x2=x1+figure.width;
							y2=y1+hei_;
						}
					}
					else {
						if (grad.type==`radial`) Radius=figure.star.innerRadius*1.28;
						else {
							const length_=figure.star.innerRadius*1.28;
							x1-=length_;
							y1-=length_;
							x2=x1+length_*2;
							y2=y1+length_*2;
						}
					}
				}
				var gradient;
				 if (mainCanvas) {gradient=(this.type==`linear`) ? ctx.createLinearGradient(x1,y1,x2,y2) : ctx.createRadialGradient(x1,y1,Radius,x1,y1,Radius*0.375)}
				 else {gradient=(this.type==`linear`) ? ctx2.createLinearGradient(0,0,100,100) : ctx2.createRadialGradient(50,50,40,50,50,15)}
				 this.mass.forEach(function (el) {
					 gradient.addColorStop(el[0]/100,el[1]);
				 });
				 return gradient;
			}
		}
		var figure={
			width:50,
			height:50,
			type:`rect`,
			border:0,
			angle:0,
			star:{
				spikes:6,
				outerRadius:60,
				innerRadius:70,
				lineColor:`white`,
				drawStar(cx, cy, spikes, outerRadius, innerRadius,lineColor=drawColor) {
					var rot = Math.PI / 2 * 3;
					var x = cx;
					var y = cy;
					var step = Math.PI / spikes;
					ctx.beginPath();
					ctx.moveTo(cx, cy - outerRadius)
					for (var i = 0; i < spikes; i++) {
							x = cx + Math.cos(rot) * outerRadius;
							y = cy + Math.sin(rot) * outerRadius;
							ctx.lineTo(x, y)
							rot += step
							x = cx + Math.cos(rot) * innerRadius;
							y = cy + Math.sin(rot) * innerRadius;
							ctx.lineTo(x, y)
							rot += step
					}
					ctx.lineTo(cx, cy - outerRadius)
					ctx.closePath();
					inst.line(lineColor,5)
					inst.back(drawColor)
					ctx.stroke();
				}
			},
			cutCircle:{
				set:false,
				clear(){
					$(`.top__back`).hide();
					$(`.pointCircle`).remove();
					$(`.circleSet`).remove();
					const fig_=figure.cutCircle
					fig_.dotsMass.length=0;
					fig_.set=false;
				},
				dotsMass:[],
				rotate:true
			}
		}
		var pressMass=[35,40,34,37,12,39];
		$(`[controlPanel]`).each(function () {
			$(this).find(`.all__radio`).each(function (index) {
				$(this).attr(`key`,pressMass[index])
			})
		})
						//!!help
						var  helpMassRand=[
							`press Z while drawing to the the size of cursor`,
							`use 1,2,3 to quickly select instruments`,
							`you can change the field color in settings menu`,
							`press  CTRL  + Enter  to insert value in input`,
							`press CTRL + right click on a dot to delete it`,
							`press CTRL + Enter on field to draw figure from lines`,
							`Ctrl + Delete to delete a circleCut`
						];
							var helpMass=[
							`press CTRL to draw and spin wheel to change size`,
							`select the color of all your drawing`,
							`Right Click to place text`,
							`Right click to erase`,
							`Rigth click to set a point and CTRL + Enter to draw a figure`,
							`Right Click to place figure and wheel to change its size`,
							`Right click to place gradient`,
							`set the drawing field`
						]
							var previous=``;
							function setTip_() {
								if (!allowTips) return;
								do {
									var text=[... helpMassRand].sort(function () {return Math.random()-0.5})[0];
								}	while (text==previous)
								previous=text;
								$(`#text`).text(text)
							}
							setTip_();
							setInterval(function () {
								if (!smthIsActive) setTip_();
							},10000);

							//!!help
		//About draw
		function AllowClick() {
			allowClick=false;
			setTimeout(()=>allowClick=true,600);
		}
		function showDots() {
			$(`#dotNumber`).text(`*`+line.mass.length)
		}
		var timeout;
		function warn(text){
			$(`#text`).text(text);
			$(`.all__help`).addClass(`warn`);
			clearTimeout(timeout);
			timeout=setTimeout(()=>{
				$(`.all__help`).removeClass(`warn`);
				$(`#text`).text(helpMass[4]);
			},3000);
		}
		//!!global
		$(`textarea`).val(font.text)
		$(`img`).each(function () {
			$(this).attr(`draggable`,false)
		})
		$(`${d}block`).each(function (ind) {
			$(this).attr(`active`,false).attr(`index`,ind);
		})
		var massShower=[`.all__block`,`.shower2`].forEach(function (el) {
			$(el).on(`mouseenter`,function () {
				mouseIn=setInterval(()=>{
					var ind_=$(this).attr(`index`);
					if ($(this).attr(`active`)==`true` && (ind_==6 || ind_==1)) return;
					if (allowTips)	$(this).find(`p`).show();
				},2000);
			});
			$(el).on(`mouseleave`,function () {
				clearInterval(mouseIn)
				$(el).find(`p`).hide();
			});
		})
		$(`[controlPanel]`).attr(`activated`,false)
		function removeColor() {
			$(`#close`).attr(`src`,`./images/crossAc.png`);
			setTimeout(()=>$(`#close`).attr(`src`,`./images/cross.png`),300);
			$(`${d}complete`).text(``);
			$(`${d}vidgePanel`).find(`*`).hide()
			$(`${d}vidgePanel`).slideUp(300,()=>{
			$(`${d}vidge`).find(`*`).hide();
			$(`${d}vidge`).addClass(`goIn`);
			setTimeout(()=>	{
				$(`${d}vidge`).removeClass(`goIn`).hide()
				$(`${d}color`).removeClass(`border`);
				$(`${d}color`).parent().attr(`active`,`false`)
			},300);
			})
	}
	var open1,open2,open3=false;
		var colors=	[`205,97,85`,`165,105,189`,`22,160,133`,`244,208,63`,`211,84,0`,`25,111,61`,`174,214,241`,`46, 42, 42`,`183,149,11`,`44,62,80`,`171,235,198`,`84,153,199`,`100,30,22`,`232,218,239`,`204,209,209`].forEach(function (el) {
			for (let i=1;i<3;i++) {
				var modify_=`rgba(`+el.trim()+`,1)`;
				var current_=$(`<div class="color" color="${modify_}" type="circ${i}"></div>`).css(`background`,modify_);
				$(`${d}grid${i}`).append(current_);
			}
		});
		//??mass
		var keys=[];
		for (let i=49,j=0;i<57;i++,j++) keys.push(i);
		var cursors=[[`pointer`,`brushAc`],[`default`,false],[`text`,`textAc`],[`cell`,`eraserAc`],[`crosshair`,`lineAc`],[`all-scroll`,`rectAc`],[`crosshair`,`frameAc`],[`default`,`gearAc`]];
		var all=[];
		var staticImg=[];
		$(`${d}block`).find(`img`).each(function () {
			staticImg.push($(this).attr(`src`));
		})
		staticImg.splice(1,0,false);
		var drawOnCanvas=[
			function Brush(move) {
				if (move.which==1) {
					inst.dr(()=>{
						(brush.type==`circle`) ? ctx.arc(x,y,brush.size,0,2*Math.PI) : ctx.rect(x-brush.size,y-brush.size,brush.size*2,brush.size*2)
						if (!grad.set || grad.mass.length==0)  inst.back(drawColor)
						else inst.back(grad.setGradient(true,x,y,`brush`));
					})
				}
			},
			function chooseColor() {
				var vidge_=$(`${d}vidge`) , panelAll=$(`${d}vidgePanel`).find(`*`);
					vidge_.find(`*`).hide();
					vidge_.show().addClass(`goOut`);
					setTimeout(()=>{
						open1=true;
						vidge_.find(`*`).show();
						vidge_.removeClass(`goOut`);
						panelAll.hide();
						$(`${d}vidgePanel`).slideDown(500,()=>{
							$(`${d}vidgePanel`).css({display:`flex`})
							panelAll.show();
						});
					},500);
				$(`#close`).on(`click`,function () {
					if (!allowClick) return;
					removeColor();
					AllowClick();
					open1=false;
					setTimeout(()=>{	$(`.all__inter`).hide()},600);
				});

			},
			function text() {
				var all_=[font.text,x,y];
				ctx.textBaseline=`top`;
				ctx.fillStyle=fast_()
				ctx.strokeStyle=fast_()
				ctx.font=`${font.weight} ${font.size}px ${font.family}`;
				(font.type==`fillText`) ? ctx.fillText(...all_) : ctx.strokeText(...all_);
				function fast_() {
					return (!grad.set || grad.mass.length==0) ? drawColor : grad.setGradient(true,x,y,`text`);
				}
			},
			function erase(move) {
				if (move.which==1) {
					inst.dr(()=>ctx.clearRect(x,y,brush.size*2,brush.size*2))
				}
			},
			function Line() {
				line.butNumber++;
				var element=$(`<div></div>`).addClass(`point`).attr(`dotIndex`,line.butNumber).css({top:globalY,left:globalX});
				line.mass.push([line.butNumber,element]);
				$(`.all`).append(element);
				line.processHasFinished=false;
				showDots()
				$(`.point`).on(`click`,function (move) {
					if (!line.timer || !move.ctrlKey) return;
					line.timer=false;
					var index=+$(this).attr(`dotIndex`);
					setTimeout(()=>{line.timer=true},100);
					$(this).remove();
					line.mass.forEach(function (elem,ind) {
						if (index==elem[0]) line.mass.splice(ind,1);
					})
					showDots();
					if (line.mass.length==0) line.processHasFinished=true;
				});
			},
			function Figure() {
				const fig_=figure.type , wid=figure.width , hei=figure.height;
				if (fig_==`rect`) inst.dr(()=> {
					ctx.rect(x-wid/2,y-hei/2,wid,hei);
					all_();
				});
				else if (fig_==`star`) {
					inst.dr(()=>{
						const copy_=figure.star;
						figure.star.drawStar(x,y,copy_.spikes,copy_.outerRadius,copy_.innerRadius,copy_.lineColor);
						all_();
					})
				}
				else if (fig_==`oval`) {
					var border;
						inst.dr(()=>{
							if (wid>=hei) {
								border=0.3*wid;
								ctx.moveTo((x-wid/2)+border,y-hei/2)
								ctx.lineTo((x+wid/2)-border,y-hei/2);
								ctx.quadraticCurveTo(x+wid/2,y,(x+wid/2)-border,y+hei/2)
								ctx.lineTo((x-wid/2)+border,y+hei/2)
								ctx.quadraticCurveTo(x-wid/2,y,(x-wid/2)+border,y-hei/2);
							} else {
								border=0.3*hei;
								ctx.moveTo(x+wid/2,y-hei/2+border);
								ctx.lineTo(x+wid/2,y+hei/2-border);
								ctx.quadraticCurveTo(x,y+hei/2,x-wid/2,y+hei/2-border);
								ctx.lineTo(x-wid/2,y-hei/2+border);
								ctx.quadraticCurveTo(x,y-hei/2,x+wid/2,y-hei/2+border);
							}
							all_()
						})
				} else {
					const cutCir_=figure.cutCircle;
					if (cutCir_.set) return;
					cutCir_.set=true;
					cutCir_.placeY=y;
					cutCir_.placeX=x;
					$(`<img src="./images/circleAnim.gif" class="circleSet" draggable="false">`).css({width:wid,height:wid,top:y-wid/2,left:x-wid/2}).appendTo($(`.top__back`));
					$(`.top__back`).show().css({cursor:`url(${inst.setPath("cursorPlaceRad")}),default`});
					$(`.circleSet`).on(`click`,function (key) {
						if (!cutCir_.set || key.ctrlKey) return;
						if (cutCir_.dotsMass.length>=2) {warn(`ypu already have 2 dots`);return}
						cutCir_.dotsMass.push([x,setY()]);
						$(`<div x="${x}" y="${setY()}"></div>`).addClass([`point`,`pointCircle`]).css({top:setY(),left:x}).appendTo($(`.top__back`));
						$(`.pointCircle`).on(`click`,function (key) {
							var the_=$(this);
							if (!key.ctrlKey) return;
							the_.remove();
							cutCir_.dotsMass.forEach(function (elem,index) {
								if (elem[0]==+the_.attr(`x`) && elem[1]==+the_.attr(`y`)) cutCir_.dotsMass.splice(index,1)
							})
						})
					});
					function setY() {
						const wid_=figure.width , pl_=cutCir_.placeY;
						if (y<pl_ && y>pl_-(3.5*wid/10)) return pl_-wid/2;
						else if (y>pl_ && y<pl_+(3.5*wid/10)) return pl_+wid/2;
						else return y;
					}
				}
				function all_() {
					inst.back((!grad.set) ? drawColor : grad.setGradient(true,x,y,`figure`));
				}
			},
			function gradient() {
				var color_=`white`;
				$(`.color`).on(`change`,function () {
					color_=$(this).val();
				})
				$(`.all__gradPanel`).show().css({height:0}).animate({height:380},600);
				open3=true;
				$(`.do`).on(`click`,function () {
					if ($(this).attr(`type`)==`cannel`) {
						$(`.number`).val(``);
						$(`.color`).val(`#FFFFFF`);
					} else {
						if (!allowClick) return
						AllowClick();
						var proz_=+$(`.number`).val();
						if (proz_>100) proz_=100;
						else if (proz_<0) proz_=0;
						if (grad.mass.length!==0) {
							if (color_==grad.color) {warn(`color can't be the same`);return}
							else if (+$([...$(`.part`)].pop()).find(`.after`).attr(`proz`)>=proz_) {warn(`% can'not be smaller than previous`);return}
						}
						grad.number++;
						grad.color=color_;
						grad.mass.push([proz_,grad.color]);
						var space=$(`<div class="part beet">
								<p id="elNum">${grad.number}</p>
								<p class="after" proz="${proz_}">${proz_} %</p>
								<img src="./images/emptyCross.png">
								</div>`);
							$(`.all__addColPanel`).append(space);
							$($(`.after`)[$(`.after`).length-1]).after($(`<div class="part__block"></div>`).css({background:grad.color}));
							//////
							setCanvExample()
							$(`.part img`).on(`click`,function () {
								if (!allowClick) return;
								AllowClick();
								var ind_=+$(this).parent().find(`#elNum`).text();
								$(this).parent().remove();
								grad.mass.splice(ind_-1,1);
								grad.number=0;
								grad.color=``;
								$(`.part`).each(function () {
									grad.number++;
									$(this).find(`#elNum`).text(grad.number);
								});
								setCanvExample()
							})
					}
				})
			},
			function settings() {
				$(`.all__pane`).attr(`active`,true)
				var pan_=$(`.all__pane`);
				pan_.find(`img`).hide();
				pan_.addClass(`paneAppear`).css({display:"flex"});
				setTimeout(()=>{pan_.removeClass(`paneAppear`);pan_.find(`img`).show()},600);
				open2=true;
			}
		]
		//??mass
		//!!events
		var  x , y , previousFunc , firstClick=true;
		function clear() {
			if (!allowClick) return;
			AllowClick();
			if (figure.cutCircle.set=true) figure.cutCircle.clear();
			$(`.point`).remove();
			line.processHasFinished=true;
			if (figure.type==`cutCircle`) figure.cutCircle.clear();
			line.mass.length=0;
			line.butNumber=0;
				ctx.clearRect(0,0,canvas.width,canvas.height);
			$(`${d}cross`).find(`img`).attr(`src`,`./images/crossAc.png`);
			setTimeout(()=>{
				$(`${d}cross`).find(`img`).attr(`src`,`./images/cross.png`);
			},300);
		}
		$(`[alt="clear"]`).on(`click`,clear);
		function setCanvExample() {
			if (grad.mass.length==0) {ctx2.clearRect(0,0,100,100);return;}
			ctx2.beginPath();
			inst.back2(grad.setGradient(false));
			ctx2.fillRect(0,0,100,100);
			ctx2.stroke();
		}
		var smthIsActive=false;
			function change_() {
				$(`.all__help`).removeClass(`warn`);
				var ind_=+$(this).attr(`index`);
				if (!allowClick) return;
				AllowClick();
				if (open1) {removeColor();open1=false;}
				var time_=0;
				if (open2) {
					open2=false;
					$(`.all__pane`).find(`img`).each(function () {
						if ($(this).attr(`active`)==`true`) {
							$(this).attr(`active`,false).attr(`src`,inst.setPath(src[+$(this).attr(`alt`)-1][0]));
							time_=500;
							settingsAppear[+$(this).attr(`alt`)-1][1]();
						}
						setTimeout(()=>{
							$(`.all__pane`).find(`img`).hide();
							$(`.all__pane`).addClass(`paneDissAppear`);
							setTimeout(()=>{$(`.all__pane`).removeClass(`paneDissAppear`).hide()},500);
							AllowClick();
						},time_);
					})
				}
				if (open3) {
					open3=false;
					$(`.all__gradPanel`).slideUp(600);
				}
				if ($(this).attr(`active`)==`false`) {
					var indo_=$(this).attr(`index`);
					$(this).find(`p`).hide();
					if (indo_==1 || indo_==6 || indo_==7)	$(`.all__inter`).show();
					else $(`.all__inter`).hide()
					$(`[controlPanel]`).hide().attr(`activated`,false);
						var elem_=$(`[ind="${(ind_==3) ? 0 : ind_}"]`);
								if (elem_) {
									elem_.css({display:elem_.attr(`controlPanel`)}).attr(`activated`,true)
								}
					$(`#text`).text(helpMass[ind_]);
					smthIsActive=true;
					$(`${d}block`).each(function (ind) {
						$(this).removeClass(`active`).attr(`active`,false);
						$(this).find(`img`).attr(`src`,staticImg[ind]);
					});
					$(this).attr(`active`,true);
					setFunc(ind_);
				} else {
					setTimeout(()=>{$(`.all__inter`).hide()},500);
					$(`[controlPanel]`).hide().attr(`activated`,false);
					$(`.all__pane`).attr(`active`,`false`)
					smthIsActive=false;
					$(this).attr(`active`,`false`);
					$(`${d}drawing`).css(`cursor`,`default`);
					if (ind_==1) {
						$(`${d}color`).removeClass(`border`);
					} else {
						if (ind_==7) {
							$(`#rotate`).addClass(`rotateBack`);
							setTimeout(()=>$(`#rotate`).removeClass(`rotateBack`),600);
						}
						$(this).find(`img`).attr(`src`,staticImg[ind_]);
						$(canvas).off(`mousemove`,previousFunc);
						$(canvas).off(`click`,previousFunc)
					}
				}
			}
		$(`${d}block`).on(`click`,function () {
			if (figure.cutCircle.set) return;
			change_.call($(this));
		})
		function setFunc(a) {
			setTimeout(()=>{
			//!!design
			$(`${d}drawing`).css(`cursor`,cursors[a][0]);
			$(`${d}color`).removeClass(`border`);
			if (a==1)	$(`${d}color`).addClass(`border`);
			else  $($(`[index=${a}]`).find(`img`)[0]).attr(`src`,`./images/${cursors[a][1]}.png`);
			 if (a==7) {
				 $(`#rotate`).addClass(`rotate`);
				 setTimeout(()=>$(`#rotate`).removeClass(`rotate`),600);
				}
				//!!design
			//??other
			$(this).find(`img`).attr(`src`,staticImg[a]);
			if (!firstClick) {
				$(canvas).off(`mousemove`,previousFunc);
				$(canvas).off(`click`,previousFunc)
			}
			previousFunc=drawOnCanvas[a];
			firstClick=false;
			if (a==1 || a==7 || a==6) drawOnCanvas[a]();
			else if (a==0 || a==3) $(`.all__drawing`).on(`mousemove`,drawOnCanvas[a])
			else $(`.all__drawing`).on(`click`,drawOnCanvas[a])
			//??other
			},0);
		}
		var globalX , globalY;
		function setCanv(move) {
			x=move.clientX-canvas.getBoundingClientRect().x;
			y=move.clientY-canvas.getBoundingClientRect().y;
		}
		$(canvas).on(`mousemove`,setCanv)
		$(`.block`).on(`mousemove`,setCanv)
		$(`.top__back`).on(`mousemove`,setCanv)
		function setMark() {
			var shower=[
				[`circleBrush`,`rectBrush`],
				,
				[`rectBrush`],
				[,,`starRect`,`circleRect`],
			];
			$(`[move]`).each(function (ind) {
				if ($(this).attr(`active`)==`true`) {
					var bl_=$(`.block`);
					bl_.text(``);
					bl_.show();
					$(`.top__back`).show();
					if (ind==0 || ind==2 || ind==3) {
						bl_.text(``).removeClass(`heightAuto`);
						var type_=0;
						if ($(this).attr(`type`)) type_=+$(this).attr(`type`);
						//*different img
						var massImg=[];
						$(`[type="figure"]`).each(function () {
							massImg.push($(this).attr(`modify`))
						});
						if ($(`[index="0"]`).attr(`active`)==`true`)
							(brush.type==`circle`) ? type_=0 : type_=1;
						if ($(`[index="5"]`).attr(`active`)==`true`)
							type_=massImg.indexOf(figure.type);
						//*different img
						var res={
							backgroundImage: ((type_==0 || type_==1) && (figure.type==`oval` || figure.type==`rect`) && $(`[index="5"]`).attr(`active`)==`true`) ? `unset` : `url(${inst.setPath(shower[ind][type_])})`,
							borderRadius:0,
							border:`none`
						}
						if (ind==2) ind=0;
						if (ind==0) {res.top=y-brush.size;res.left=x-brush.size}
						else if (ind==3) {
							const hei=figure.height , wid=figure.width;
							if (figure.type==`rect` || figure.type==`oval`)  {
								res.top=y-hei/2
								res.left=x-wid/2
								res.width=wid-border()*2
								res.height=hei-border()*2
								res.borderRadius=(figure.type==`rect`) ? 0 : `50%`;
								res.border=`${border()}px solid black`
								function border() {
									var result=(wid+hei)/20;
									if (result<2) result=2;
									else if (result>25) result=25;
									if (result>wid/2.3 || result>hei/2.3) result=2;
									return result;
								}
							}
							else if (figure.type==`cutCircle`) {
								res.top=y-wid/2;
								res.left=x-wid/2;
								res.width=wid;
								res.height=wid
							}
							else {
								const fast_=figure.star.innerRadius*1.28;
								res.top=y-fast_
								res.left=x-fast_
								res.width=fast_*2
								res.height=fast_*2
							}
						}
						bl_.css(res)
					}
					else {
						var res={
							fontSize:font.size,
							fontFamily:font.family,
							color:drawColor,
							fontWeight:font.weight.fillStyle,
						};
						if (font.type=="strokeText") {
							res.color=`rgb(46, 42, 42)`;
							res.textShadow=`1px 1px 10px ${drawColor}`;
						}
						bl_.css({backgroundImage:"none",top:y-font.size/6.5,left:x}).css(res).text(font.text).addClass(`heightAuto`);
					}
				}
			})
		}
		var check={
			brush(i,ind_,checko=true) {
				if (checko) (i()) ? brush.size++ : brush.size--;
				if (brush.size<=1) brush.size=1;
						else if (brush.size>300) brush.size=300;
						$(`[inputIndex="${ind_}"]`).val(brush.size);
						$(`.block`).css({width:brush.size*2,height:brush.size*2})
			},
			square(i,ind_,checko=true){
				if (checko) {
						if (i()) {
							if (figure.type!=`star`) {
								figure.width+=2;
								if (figure.type!=`cutCircle`) figure.height+=2;
							} else figure.star.innerRadius+=2;
						} else {
							if (figure.type!=`star`) {
								figure.width-=2;
								if (figure.type!=`cutCircle`) figure.height-=2;
							} else figure.star.innerRadius-=2;
						}
				}
				if (figure.width>600) figure.width=600;
				if (figure.height<20) figure.height=20;
				if (figure.width<20) figure.width=20;
				if (figure.height>600) figure.height=600;
				if (figure.type!=`star`) {
					$(`.width`).val(figure.width);
					if (figure.type!=`cutCircle`) $(`.height`).val(figure.height);
				} else $(`[mod="innerRadius"]`).val(figure.star.innerRadius);
			},
			line(i,ind_,checko=true){
				if (checko) (i()) ? line.width++ : line.width--;
				 if (line.width<=0) line.width=1;
				 else if (line.width>50) line.width=50;
				 $(`[inputIndex="${ind_}"]`).val(line.width)
			},
			text(i,ind_,checko=true){
				if (checko) (i()) ? font.size++ : font.size--;
				if (font.size>200) font.size=200;
				else if (font.size<0) font.size=1;
				$(`[inputIndex="${ind_}"]`).val(font.size)
			}
		}
		var windowEvents=[
			[`wheel`,function (move) {
				if (focused) return;
				$(`.all__block`).each(function () {
					var ind_=+$(this).attr(`index`)
					if ($(this).attr(`active`)==`true` && (ind_!=1 && ind_!=7)) {
						if (ind_==3) ind_=0;
						function all_() {
							return (move.originalEvent.wheelDelta==120)
						}
						var type_=[[0,`brush`],[2,`text`],[4,`line`],[5,`square`]].forEach(function (elem) {
							if (ind_==elem[0]) check[elem[1]](all_,ind_);
						})
					}
				})
			}],
			[`keyup`,function (press) {
				if (press.which==90 && !figure.cutCircle.set) {$(`.block`).hide();$(`.top__back`).hide()}
				else	if (press.which==13 && press.ctrlKey) {
					const fast_=allowClick && !focused;
					if ($(`[index="4"]`).attr(`active`)==`true` && fast_) {
						AllowClick();
						if (line.mass.length<=1) {
							warn(`you placed not enough dots`);
							return;
						}
						if (line.type==`typical`) {
							ctx.beginPath();
								line.mass.forEach(function (each) {
									ctx.lineTo(each[1].offset().left-80,each[1].offset().top-100);
								})
								all()
								ctx.stroke();
						}
						else if (line.type==`curve`) {
							if (line.mass.length%2!=0)  {
								warn(`the number of dots should be pair`)
								return;
							}
							ctx.beginPath();
							for (let i=0;i<line.mass.length;i+=2) {
								ctx.quadraticCurveTo(line.mass[i][1].offset().left-80,line.mass[i][1].offset().top-100,line.mass[i+1][1].offset().left-80,line.mass[i+1][1].offset().top-100);
							}
							all()
							ctx.stroke();
						} else {
							if (line.mass.length%3!=0)  {
								warn(`the number of dots should be %3==0`)
								return;
							}
							ctx.beginPath();
							for (let i=0;i<line.mass.length;i+=3) {
								ctx.bezierCurveTo(line.mass[i][1].offset().left-80,line.mass[i][1].offset().top-100,
								line.mass[i+1][1].offset().left-80,line.mass[i+1][1].offset().top-100,
								line.mass[i+2][1].offset().left-80,line.mass[i+2][1].offset().top-100)
							}
							all();
							ctx.stroke();
						}
						function all() {
							inst.line(drawColor,line.width)
							ctx.lineJoin=`round`;
							if (line.closePath) ctx.closePath();
							if (line.fill) {
								(!grad.set || grad.mass.length==0) ? inst.back(drawColor) : inst.back(grad.setGradient(true,``,``,`line`))
							}
							$(`.point`).remove();
							line.mass.length=0;
							line.processHasFinished=true;
							line.butNumber=0;
							showDots();
							$(`.all__help`).removeClass(`warn`);
							$(`#text`).text(helpMass[4])
						}
					}
					else if ($(`[index="5"]`).attr(`active`)==`true` && fast_ && !focused) {
						if (figure.cutCircle.dotsMass.length!=2) {warn(`you don't have enough dots`);return}
								const elem=figure.cutCircle.dotsMass , previous=figure.cutCircle.placeY , el_=-figure.cutCircle.placeX+figure.width/2;
								var from=(elem[0][1]<previous) ? (((elem[0][0]+el_)/(figure.width*2))*2)+1 : 1-((elem[0][0]+el_)/(figure.width*2))*2;
								var to=(elem[1][1]<previous) ? (((elem[1][0]+el_)/(figure.width*2))*2)+1 : 1-((elem[1][0]+el_)/(figure.width*2))*2;
								from*=Math.PI;
								to*=Math.PI;
								const fig_=figure.cutCircle;
								inst.dr(function () {
									ctx.arc(fig_.placeX,fig_.placeY,figure.width/2,from,to,fig_.rotate);
									inst.back((grad.set) ? grad.setGradient(true,fig_.placeX,fig_.placeY,`figure`) : drawColor);
								})
								figure.cutCircle.clear();
					}
					}
					else 	{
						pressMass.forEach(function (elem,index) {
							if (press.which==elem) {
								$(`[controlPanel]`).each(function () {
									if ($(this).attr(`activated`)!=`true` || index>=$(this).find(`.all__radio`).length) return;
									radio.call($(this).find(`[key="${elem}"]`))
								})
							}
						})
						if (press.which==88 && press.ctrlKey) clear();
						else if (press.which==46 && press.ctrlKey) figure.cutCircle.clear();
						else {
								for (let i=0;i<keys.length;i++) {
									if (press.which==keys[i] && !focused && !figure.cutCircle.set)  {
										change_.call($(`[index="${i}"]`))
									}
								}
							}
						}
			}],
			[`keypress`,function (press) {
				if (press.which==122 && globalX>80 && globalY>100 && globalY<$(this).height()-120 && !figure.cutCircle.set) setMark()
			}],
			[`mousemove`,function (move) {
				globalX=move.clientX;
				globalY=move.clientY;
			}],
			[`resize`,function () {
				canvas.width=$(window).width()-80;
			}]
		].forEach(function (el) {
			$(window).on(el[0],el[1])
		})
		$(`[inputIndex]`).on(`keydown`,function (key) {
			if (key.which==13 && key.ctrlKey) {
				var ind_=+$(this).attr(`inputIndex`);
				var fast_=[function true_() {return true;},ind_,false];
				if (ind_==0) {brush.size=+$(this).val();check.brush(...fast_)}
				else if (ind_==4) {line.width=+$(this).val();check.line(...fast_)}
				else if (ind_==5) {
					var mod_=$(this).attr(`mod`);
					if (mod_) {
						var mass_=[];
						$(`[mod]`).each(function () {
							mass_.push($(this).attr(`mod`));
						})
						mass_.pop();
						for (let i=0;i<mass_.length;i++) {
							if (mod_==mass_[i]) {
								figure.star[mass_[i]]=$(this).val();
								if (figure.star.spikes>80) figure.star.spikes=80;
								if (figure.star.spikes<4) figure.star.spikes=4;
								if (figure.star.outerRadius<0) figure.star.outerRadius=0;
								if (figure.star.outerRadius>400) figure.star.outerRadius=400;
								if (figure.star.outerRadius>figure.star.innerRadius) figure.star.outerRadius=figure.star.innerRadius;
								if (figure.star.innerRadius>400) figure.star.innerRadius=400;
								if (figure.star.innerRadius<1) figure.star.innerRadius=1;
								$(this).val(figure.star[mass_[i]])
							}
						}
					} else {
						figure.width=+$(`.width`).val();
						figure.height=+$(`.height`).val();
						check.square(...fast_)}
					}
				else if (ind_==6) {
					if (+$(this).val()>100) $(this).val(100);
					else if (+$(this).val()<0) $(this).val(0);
				}
				$(this).blur()
			}
		})
		$(`input`).on(`focus`,function () {
			focused=true;
		})
		$(`input`).on(`focusout`,function () {
			setTimeout(()=>focused=false,300);
		})
		var radioMass=[
			[`text`,(el)=>{
				font.type=el.attr(`modify`);
			}],
			[`brush`,(el)=>{
				brush.type=el.attr(`modify`)
			}],
			[`line`,(el)=>{
				if (!line.processHasFinished) return;
					line.type=el.attr(`modify`);
					$(`[alt="lineImg"]`).removeClass(`lineSelected`);
					el.parent().find(`img`).addClass(`lineSelected`);
			}],
			[`grad`,(el)=>{
				grad.type=el.attr(`modify`);
				setCanvExample();
			}],
			[`figure`,(el)=>{
				const vis_=`circleRectVisibility`;
				if (el.attr(`modify`)==`star`) { $(`.all__starSet`).removeClass(vis_);$(`.all__status`).addClass(vis_) }
				else { $(`.all__starSet`).addClass(vis_);$(`.all__status`).removeClass(vis_)}
				if (el.attr(`modify`)==`cutCircle`) {
					$(`.all__height`).hide();
					$(`.all__rotate`).css({display:"flex"});
				} else {
					$(`.all__rotate`).hide();
					$(`.all__height`).css({display:"flex"})
				}
				figure.type=el.attr(`modify`);
			}],
			[`figureCutCircle`,(el)=>{
				figure.cutCircle.rotate=JSON.parse(el.attr(`modify`));
			}]
		]
		$(`.all__radio`).on(`click`,radio);
		function radio() {
			if ($(this).hasClass(`selectedRadio`) || ($(`[index="4"]`).attr(`active`)==`true` && !line.processHasFinished)) return;
			var checker_=false , key_=+$(this).attr(`key`);
			var pressMass_=pressMass.slice(0,4).forEach(function (elem) {
				if (elem==key_) checker_=true
			})
			if (figure.cutCircle.set && checker_) return;
				var type_=$(this).attr(`type`);
				radioMass.forEach((elem)=>{
					if (type_==elem[0]) elem[1]($(this))
				});
				$(`[type="${type_}"]`).removeClass(`selectedRadio`);
				$(this).addClass(`selectedRadio`);
		}
		$(`[textInput]`).on(`keydown`,function (key) {
			if (key.which==13 && key.ctrlKey) {
				var val=+$(this).val();
				if (val<=0) val=1;
				if ($(this).attr(`textInput`)==`0`) {
					 if (val>900) val=900;
						font.weight=val;
				} else {
					if (val>200) val=200;
					font.size=val;
				}
				$(this).val(val);
				$(this).blur()
			}
		})
		var timerCross=true;
		$(`[src="./images/cross.png"]`).on(`click`,function () {
			if (!timerCross) return;
			timerCross=false
			$(this).attr(`src`,`./images/crossAc.png`);
			setTimeout(()=>{
				timerCross=true;
				$(this).attr(`src`,`./images/cross.png`);
			},300);
		});
		$(`[src="./images/okChange.png"]`).on(`click`,function () {
			if (!timerCross) return;
			timerCross=false;
			$(this).addClass(`backgroundBlack`);
			setTimeout(()=>{
				timerCross=true
				$(this).removeClass(`backgroundBlack`);
			},300);
		})
		var events={
			color(){
				$(`.color[type="circ1"]`).on(`click`,function () {
					var taker_=$(this).attr(`color`);
					drawColor=taker_;
					$(`${d}color`).css(`background`,drawColor);
				});
				$(`${d}canel`).on(`click`,function () {
					$(`${d}RGBA`).val(`#FFFFFF`);
					drawColor=`white`;
					$(`${d}color`).css(`background`,drawColor);
				});
				$(`${d}submit`).on(`click`,function () {
					if (!allowClick) return;
					drawColor=color.type;
					$(`${d}color`).css(`background`,drawColor);
				});
				$(`.all__RGBA`).on(`change`,function () {
					color.type=$(this).val();
				})
			},
			text() {
				$(`textarea`).on(`keydown`,function (key) {
					if (key.which==13 && key.ctrlKey) {font.text=$(this).val();$(this).blur()}
				})
				var family=[`monospace`,`cursive`,`fantasy`,`sans-serif`,`system-ui`,`serif`].forEach(function (each,ind) {
					var element=$(`<div><p>${each}</p></div>`).css({fontFamily:each}).addClass(`all__option`);
					if (ind==5) element.addClass(`activeOption`);
					element.appendTo($(`.all__bigCont`))
				})
				function fast2_(thi) {
					thi.attr(`active`,false);
						$(`.all__bigCont`).addClass(`goDown`).removeClass(`goUp`);
						setTimeout(()=>{$(`.all__bigCont`).hide()},600);
				}
				$(`[alt="select"]`).on(`click`,function () {
					if (!allowClick) return;
					AllowClick();
					if ($(this).attr(`active`)==`false`) {
						$(this).removeClass(`rotateArrowBack`).addClass(`rotateArrow`);
						$(this).attr(`active`,true);
						$(`.all__bigCont`).removeClass(`goDown`).addClass(`goUp`).show();
					} else {
						$(this).removeClass(`rotateArrow`).addClass(`rotateArrowBack`);
						fast2_($(this));
					}
				})
				$(`.all__bigCont div`).on(`click`,function () {
					if ($(this).hasClass(`activeOption`) || !allowClick) return;
					$(`.all__bigCont div`).removeClass(`activeOption`);
					$(this).addClass(`activeOption`);
						fast2_($(this));
						AllowClick();
						var text_=$(this).find(`p`).text();
						font.family=text_;
						$(`[alt="select"]`).removeClass(`rotateArrow`).addClass(`rotateArrowBack`);
						$(`[alt="select"]`).attr(`active`,false);
						$(`.all__showFont p`).text(text_)
				})
			},
			line() {
				$(`.checkbox`).on(`click`,function () {
					var active_=!JSON.parse($(this).attr(`active`));
					$(this).attr(`active`,active_);
					($(this).attr(`active`)==`true`) ? $(this).addClass(`checkboxImg`) : $(this).removeClass(`checkboxImg`)
					if ($(this).attr(`modify`)==`closePath`) {
					if	($(this).attr(`active`)==`false`) {
						$(`#lastBox`).css({visibility:`hidden`})
						$(`[modify="fill"]`).removeClass(`checkboxImg`).attr(`active`,false);
						line.fill=false;
					}
					else	$(`#lastBox`).css({visibility:`visible`})
						line.closePath=active_;
					} else line.fill=active_;
				})
			},
			settings(){
				$(`.all__scala`).on(`click`,function (move) {
					if (move.clientX>=90 && move.clientX<=309) {
						$(`.all__line`).offset({left:move.clientX});
						$(`.all__progress`).css({width:move.clientX-90,background:canvasColor});
						canvasOpacity=Math.floor((move.clientX-90)*(100/219))/100;
						var result=canvasColor.split(``);
						result.splice(result.lastIndexOf(`,`)+1,6);
						result.push(canvasOpacity,`)`);
						canvasColor=result.join(``);
						$(`.all__drawing`).css({background:canvasColor});
						$(`.all__show`).offset({left:(move.clientX-90)+60});
						$(`.all__show`).find(`div`).text(`${canvasOpacity}/1`)
					}
				});
				$(`.all__But`).on(`click`,function () {
					if ($(this).attr(`what`)==`on`)  {allowTips=true;$(`.all__help img`).show();$(`#text`).text(helpMass[7])}
					else {allowTips=false;$(`#text`).text(``);$(`.all__help img`).hide()}
					($(this).attr(`what`)==`on`) ? $(`.all__But[what="off"]`).removeClass(`activeBut`) : $(`.all__But[what="on"]`).removeClass(`activeBut`);
					$(this).addClass(`activeBut`);
				});
				$(`[type="circ2"]`).on(`click`,function () {
					canvasColor=$(this).attr(`color`).split(``);
					canvasColor.pop()
					canvasColor.pop()
					canvasColor.push(canvasOpacity,`)`);
					canvasColor=canvasColor.join(``);
					$(`.all__drawing`).css({background:canvasColor});
				});
				src=[[`canvas`,`canvasAc`],[`lapm`,`lapmAc`],[`trumpet`,`trumpetAc`]];
				settingsAppear=[
				 [function () {$(`.all__grid-container`).slideDown(500)},function () {$(`.all__grid-container`).slideUp(500)}],
				 [function () {$(`.all__scala`).addClass(`goRight`).show();setTimeout(()=>{$(`.all__scala`).removeClass(`goRight`)},500);},function () {$(`.all__scala`).addClass(`goLeft`);setTimeout(()=>{$(`.all__scala`).removeClass(`goLeft`).hide()},500)}],
				 [function () {$(`.all__agree`).fadeIn(500).css({display:"flex"})},function () {$(`.all__agree`).fadeOut(500)}]
			 ];
			 $(`.setImg`).on(`click`,function () {
				 if (!allowClick) return;
				 AllowClick();
				 var timer=0;
				 var ind_=+$(this).attr(`alt`)-1;
				 if ($(this).attr(`active`)==`false`) {
					 $(`.setImg`).each(function (ind) {
						 if ($(this).attr(`active`)==`true`) {
							 $(this).attr(`active`,`false`).attr(`src`,`./images/`+src[ind][0]+`.png`);
							 settingsAppear[ind][1]();
							 timer=300;
						 }
					 })
					 setTimeout(()=>{
						 $(this).attr(`active`,`true`).attr(`src`,`./images/`+src[ind_][1]+`.png`);
						 settingsAppear[ind_][0]();
						 timer=0
					 },timer);
				 } else {
					 $(this).attr(`active`,`false`).attr(`src`,`./images/`+src[ind_][0]+`.png`);
					 settingsAppear[ind_][1]();
				 }
			 });
			},
			gradient(){
				$(`.all__submit div`).on(`click`,function () {
					if ($(this).hasClass(`activeBut`)) return;
					if (grad.mass.length>0) {
						$(`.all__submit div`).removeClass(`activeBut`);
						$(this).addClass(`activeBut`);
					}
					grad.set= ($(this).attr(`what`)==`on` && grad.mass.length>0);
				})
			},
			figure(){
				$(`[mod="lineColor"]`).on(`change`,function () {
					figure.star.lineColor=$(this).val();
				});
			}
		}
		var massEvent=[`text`,`line`,`settings`,`color`,`gradient`,`figure`].forEach(function (el) {
			events[el]();
		})
		//!!events
	}
}
DrawIo.canvasCreate();