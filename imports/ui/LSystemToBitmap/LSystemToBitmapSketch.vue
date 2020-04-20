<template>
	<vue-p5 v-on="{ setup, draw}"></vue-p5>
</template>

<script>
	import VueP5 from 'vue-p5';
	 
	export default {

		methods: {
		    setup(sketch) {
		      sketch.background('white');
		      sketch.resizeCanvas(this.parentWidth, 400);

		      sketch.s=20;
		      sketch.timer = 0;
		      sketch.isFlashing = true;
	    	},


	    	draw(sketch) {

				sketch.background('white');
				sketch.strokeWeight(2);
				sketch.fill('white');
				sketch.rect(0,0, sketch.width, sketch.height);



				let x = sketch.width/2;
				let y = 0;
				let dir = 0;

				sketch.noStroke();
				sketch.fill('black');


				let nodes = [];
				for (var i = 0; i < this.turtle.length; i++) {
					let c = this.turtle.charAt(i);
					if (c == '+') {
						dir = (dir + 1)%4;
					}
					else if (c == '-') {
						dir = (dir-1)%4;
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
						
						x = this.nextX(x, dir);
						y = this.nextY(y, dir);
					}	

					else {
						x = this.nextX(x, dir);
						y = this.nextY(y, dir);
						sketch.rect(x, y, this.rectSize, this.rectSize);
					}
				}
				//preview du prochain
				this.flash(sketch, this.nextX(x, dir), this.nextY(y, dir));
				
	    	},

	    	nextY(y, dir) {
	    		if (dir%2 == 0) {
					y += (dir == 0)?this.rectSize:-this.rectSize;
				}
				return y;
	    	},

	    	nextX(x, dir) {
	    		if (dir%2 != 0) {
					x+= (dir ==1)?this.rectSize:-this.rectSize;
				}
				return x;
	    	},


	    	flash(sketch, x, y) {
	    		if (sketch.millis()-sketch.timer > 100) {
	    			sketch.timer=sketch.millis();
		    		sketch.noStroke();
		    		sketch.isFlashing = !sketch.isFlashing;
		    	}
		    	if (sketch.isFlashing) {
					sketch.fill('grey');
					sketch.rect(x, y, this.rectSize, this.rectSize);
				}
	    	},

	  	},


	  	props: {
	  		text: String,
	  		rules: Map,
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

	  		rectSize: function(){
	  			return this.parentWidth/40;
	  		},
	  	},

	  	components: {
		    "vue-p5": VueP5
		},

		

	}

	
	
</script>

<style scoped>

</style>