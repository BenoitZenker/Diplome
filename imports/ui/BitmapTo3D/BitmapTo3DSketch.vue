<template>
	<vue-p5 v-on="{ setup, draw, mouseclicked}"></vue-p5>
</template>

<script>
	import VueP5 from 'vue-p5';
	 
	export default {

		data(){
			return{
				pixels:Array,
				pixSize:Number,
			}
		},

		methods: {

			handleResize() {
	    		this.sketch.resizeCanvas(this.width, this.height);
	    		this.pixSize = this.width/this.imgDim;
	    	},

		    setup(sketch) {
		    	this.sketch = sketch;

		      	sketch.resizeCanvas(this.width, this.height);
		      	window.addEventListener('resize', this.handleResize);

		      	this.pixSize = this.width/this.imgDim;

			    this.pixels = [];
			    for (let i =0; i< this.imgDim; i++){
			    	this.pixels[i] = []
			      	for (let j=0; j<this.imgDim; j++)
			      		this.pixels[i][j] = false;
			    }
	    	},


	    	draw(sketch) {
	    		

				this.sketch.clear();
		      	this.sketch.background('rgba(255,255,255, 0.5)');


				sketch.noStroke();
				sketch.fill('black');

				for (let y =0; y< this.imgDim; y++){
		      		for (let x=0; x<this.imgDim; x++)
		      			if (this.pixels[y][x])
		      				sketch.rect(x*this.pixSize, y*this.pixSize, this.pixSize, this.pixSize);
		     	}
		     	
	    	},


	    	mouseclicked(sketch) {



	    		let x= Math.floor(sketch.mouseX/this.pixSize);
	    		let y= Math.floor(sketch.mouseY/this.pixSize);

	    		//TODO trouver un moyen plus propre de limiter les event clic au canvas
	    		if (x >=0 && x<this.imgDim && y >=0 && y<this.imgDim) {
	    			this.pixels[y][x] = true;

	    		//préviens le parent 
	    		//!!inverser les valeurs
	    		this.$emit('update-p5-image',this.imgDim -(x+1) ,this.imgDim-(y+1));
	    		}
	    	},


	    	clearAllPixels(){
	    		for (let y =0; y< this.imgDim; y++){
		      		for (let x=0; x<this.imgDim; x++)
		      			this.pixels[y][x] = false;
		     	}
	    	}
	  	},


	  	props: {
	  		imgDim:Number,
	  		width:Number,
	  		height:Number,
	  	},

	  	components: {
		    "vue-p5": VueP5
		},

	}

	
	
</script>

