<template>
	<vue-p5 v-on="{ setup, draw}"></vue-p5>
</template>

<script>
	import VueP5 from 'vue-p5';
	
	 
	export default {

		methods: {
		    setup(sketch) {

		    this.sketch = sketch;

		    sketch.background('white');
		    sketch.resizeCanvas(this.parentWidth, this.parentHeight);

		    //l'animtion du pixel suivant
		    sketch.s=20;
		    sketch.timer = 0;
		    sketch.isFlashing = true;

		    sketch.size = 740;	//taille de l'image
		    sketch.border = 2;	//epaisseur du cadre pour l'affichage
		    sketch.res = 16;
		    sketch.pixelSize = sketch.size/sketch.res;
		    sketch.pg = sketch.createGraphics(sketch.size, sketch.size);

		    //tous les pixels de l'image
		    sketch.pixels = [];
	    },


	    	draw(sketch) {

				sketch.background('white');

				//la bordure
				sketch.fill('black');
				sketch.rectMode(sketch.CENTER);
				//sketch.rect(sketch.width/2, sketch.height/2, sketch.size+sketch.border,sketch.size+sketch.border);

				

				let x = 0;
				let y = 0;
				let dir = 0;

				sketch.pixels = new Array(sketch.res * sketch.res)

				
				//l'image
				sketch.pg.background(sketch.color(200, 200, 200));
				sketch.pg.noStroke();
				sketch.pg.fill('black');


				let nodes = [];

				for (var i = 0; i < this.turtle.length; i++) {
					let c = this.turtle.charAt(i);
					if (c == '+') {
						dir = (dir + 1)%4;
					}
					else if (c == '-') {
						dir = (dir-1)%4;
						dir = dir<0?3:dir;
					}

					else if (c =='[') {
						nodes.push({x:x, y:y, dir:dir});
					}
					else if (c == ']') {
						let n = nodes.pop();
						x=n.x;
						y=n.y;
						dir=n.dir;	
					}

					else if (c == " ") {
						
						x = this.nextX(sketch, x, dir);
						y = this.nextY(sketch, y, dir);
					}	

					else {
						sketch.pg.rect(x, y, sketch.pixelSize, sketch.pixelSize);
						x = this.nextX(sketch, x, dir);
						y = this.nextY(sketch, y, dir);

						//sauvegarde de l'état du pixel
						//ligne par ligne (y=0, y= 1, etc...)
						sketch.pixels[(y/sketch.pixelSize)*sketch.res + x/sketch.pixelSize] = true;

					}

					//boucle si on dépasse du cadre
					if (x >= sketch.pg.width)
						x = 0;
					else if (x<0)
						x = sketch.pg.width-sketch.pixelSize;
					if (y >= sketch.pg.height)
						y = 0;
					else if (y <0)
						y = sketch.pg.height-sketch.pixelSize;
				}

				//preview du prochain
				this.flash(sketch, x, y, dir, sketch.pg);


				//affichage de l'image
				sketch.rectMode(sketch.CENTER);
				sketch.image(sketch.pg, (sketch.width-sketch.pg.width)/2, (sketch.height-sketch.pg.height)/2);


				
	    	},

	    	nextY(sketch, y, dir) {
	    		if (dir%2 == 0) {
					y += (dir == 0)?sketch.pixelSize:-sketch.pixelSize;
				}
				return y;
	    	},

	    	nextX(sketch, x, dir) {
	    		if (dir%2 != 0) {
					x+= (dir ==1)?sketch.pixelSize:-sketch.pixelSize;
				}
				return x;
	    	},

	    	
	    	flash(sketch, x, y, dir, pg) {
	    		if (sketch.millis()-sketch.timer > 100) {
	    			sketch.timer=sketch.millis();
		    		sketch.isFlashing = !sketch.isFlashing;
		    	}
		    	if (sketch.isFlashing) {
					sketch.pg.fill('grey');
					sketch.pg.rect(x, y, sketch.pixelSize, sketch.pixelSize);
					sketch.pg.fill('black');

					//le point qui affiche la direction
					if (dir%4 == 0)
						sketch.pg.ellipse(x+sketch.pixelSize/2,y+sketch.pixelSize-4,4,4);
					else if (dir%4 == 2)
						sketch.pg.ellipse(x+sketch.pixelSize/2,y+4,4,4);
					else if (dir%4 == 1)
						sketch.pg.ellipse(x+sketch.pixelSize-4,y+sketch.pixelSize/2,4,4);
					else
						sketch.pg.ellipse(x+4,y+sketch.pixelSize/2,4,4);
				}
	    	},

	    	/*
	    	exportBitmap(){
	    		console.log("saving img");
	    		let json = {};
	    		json.width = this.sketch.res;
	    		json.height = this.sketch.res;
	    		this.sketch.saveJSON(json, 'img.json');
	    	},
			*/
	    	

	  	},


	  	props: {
	  		text: String,
	  		rules: Array,
	  		nb: Number,
	  		parentWidth: Number,
	  		parentHeight: Number,
	  	},

	  	computed: {
	  		turtle:function(){
	  			console.log(this.rules);
	  			//copie de l'expression
	  			let expr = (this.text).repeat(1);
	  			let nb = this.nb;


	  			for (let rule of this.rules.values()){
	  				let t = rule.target;
		  			let r = rule.rule;
					
					//on applique la règle seulement si elle existe
		  			if (t!= "" && r !="") {
		  				let re = new RegExp(t, "g");
						for (var i = 0; i < nb; i++) {
		    				expr = expr.replace(re, r);
		  				}
		    		}	
	  			}
	  			
	    		return expr;
	  		},
	  	},

	  	components: {
		    "vue-p5": VueP5
		},

		

	}

	
	
</script>

<style scoped>

</style>