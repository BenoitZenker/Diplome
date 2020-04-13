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

		      for (var i = 0; i < this.text.length; i++) {
		      	let c = this.text.charAt(i);
		      	if (c == ',') {
		      		dir = (dir + 1)%4;
		      	}
		      	else if (c == c.toUpperCase()) {
		      		if (dir%2 == 0) {
		      			y += (dir == 0)?sketch.s:-sketch.s;
		      		}
		      		else {
		      			x+= (dir ==1)?sketch.s:-sketch.s;
		      		}

 					sketch.rect(x, y, sketch.s, sketch.s);

				}	
				else if (c==c.toLowerCase()){
 					y+=sketch.s;
				}
		      }
	    	},

	  	},


	  	props: {
	  		text: String,
	  		parentWidth: Number,
	  		parentHeight: Number,
	  	},

	  	components: {
		    "vue-p5": VueP5
		},


	}

	
	
</script>

<style scoped>

</style>