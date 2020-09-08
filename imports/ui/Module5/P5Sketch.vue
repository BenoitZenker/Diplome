<template>
	<div>
		<vue-p5  v-on="{ setup, draw}"></vue-p5>
	</div>
</template>

<script>



	import VueP5 from 'vue-p5';
	 
	export default {

		data(){
			return{
				pixSize:Number,
				sketch:Object,
			}
		},

		props: {
	  		imgDim:Number,
	  		width:Number,
	  		height:Number,
	  		pixels:Array,
	  	},

	  	mounted:function(){
	  	},

		methods: {

			handleResize() {
	    		this.sketch.resizeCanvas(this.width, this.height);
	    		this.pixSize = this.width/this.imgDim;
	    	},

		    setup(sketch) {

		    	this.sketch = sketch;
		      	this.sketch.resizeCanvas(this.width, this.height);
		      	window.addEventListener('resize', this.handleResize);
		      	this.pixSize = this.width/this.imgDim;

		      	this.sketch.noStroke();
				sketch.rectMode(sketch.CORNER);
	    	},


	    	draw(sketch) {	
	    		this.sketch.clear();
		      	this.sketch.background('rgba(255,255,255, 0.5)');	

	    		this.drawImage();  
	    	},



	    	drawImage(sketch){

	    		this.sketch.fill(10,10,10,20)
		      	this.sketch.rect(0,0, this.width, this.width);


				for (let y =0; y< this.imgDim; y++){
		      		for (let x=0; x<this.imgDim; x++) {
		      			let c = this.pixels[y][x];
		      			if (c) {
		      				//console.log(c)
		      				//sketch.fill(sketch.color('hsl('+c.h+','+c.s+'%,'+c.l+'%)'))
		      				this.sketch.fill(this.sketch.color('hsl('+c.h+','+c.s+'%,'+c.l+'%)'))
		      				this.sketch.rect(x*this.pixSize, y*this.pixSize, this.pixSize, this.pixSize);
		      			}
		      		}
		     	}
	    	},
	  	},


	  	components: {
		    "vue-p5": VueP5
		},

	}

	
	
</script>

