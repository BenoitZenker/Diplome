<template>
	<vue-p5 v-on="{ setup, draw}"></vue-p5>
</template>

<script>
	import VueP5 from 'vue-p5';
	 
	export default {

		data(){
			return{
			}
		},

		methods: {
		    setup(sketch) {

		    	this.sketch = sketch;

		      	sketch.resizeCanvas(this.width, this.height);
		      	window.addEventListener('resize', this.handleResize);
	    	},

	    	drawPixels() {
	    		

	    		this.sketch.clear();
		      	this.sketch.background('rgba(255,255,255, 0.5)');

				let pixSize = this.width/this.imgDim;

				this.sketch.noStroke();
				this.sketch.fill('black');
				//affichage pixels de base

		     	if (this.pixelsOG.length > 0) {

		    		for (let y=0; y<this.imgDim; y++){
			      		for (let x=0; x<this.imgDim; x++)
			      			if (this.pixelsOG[y][x]) {
			      				//on inverse le y à nouveau
			      				this.sketch.rect(x*pixSize,(this.imgDim-(y+1))*pixSize,pixSize, pixSize);

			      			}
			     	}
		     	}

		     	
	    	},


	    	draw(sketch) {
	    		this.drawPixels();
	    	},

	    	handleResize() {
	    		this.sketch.resizeCanvas(this.width, this.height);
	    	},
	  	},


	  	props: {
	  		imgDim:Number,
	  		pixelsOG:Array,
	  		width:Number,
	  		height:Number,
	  	},

	  	components: {
		    "vue-p5": VueP5
		},

	}

	
	
</script>
