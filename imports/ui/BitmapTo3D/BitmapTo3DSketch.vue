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
		    setup(sketch) {
		      sketch.background('white');
		      sketch.resizeCanvas(200,200);

		      this.pixels = [];
		      for (let i =0; i< this.imgDim; i++){
		      	this.pixels[i] = []
		      	for (let j=0; j<this.imgDim; j++)
		      		this.pixels[i][j] = false;
		      }

		      this.pixSize = sketch.height/this.imgDim;

	    	},


	    	draw(sketch) {
				sketch.background('blue');

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
	    		this.$emit('update-p5-image',x,y);
	    		}

	    		

	    	}

	 
	  	},


	  	props: {
	  		imgDim:Number,
	  	},



	  	computed: {
	  	},

	  	components: {
		    "vue-p5": VueP5
		},

	}

	
	
</script>

<style scoped>

</style>