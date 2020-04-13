<template>
  <div id="NavLeft">
    <input type="button" value="Revenir à ...">
  </div>
</template>



<script>

</script>




<style scoped>
  #NavLeft {
    position:fixed;
    top:40px;
    left:0;
    width:250px;
    height:100vh;

    display:flex;
    flex-direction: column;
    align-items:center;
    justify-content: center;

    /*background-color: blue;*/

  }


  input {
    font-size:18px;
    padding:4px 16px 4px 16px;
    border-radius:0;
    color:black;
    border: none;
    display:block;

    margin-bottom:4px;
  }

</style>