<h3>condiFormat</h3>

This is a simple plugin for jQuery to allow conditional formatting. 
It separates the workload into smaller chunks and runs async to avoid keeping the browser busy for too long. 
The async properties along with other properties can be changed via the options parameter

<h5>Usage example</h5>
<pre>$('table#mainTable td').condiFormat({'midColor': '#FFFFFF'});</pre>

<h5>Options</h5>
<ul>
<li><b>highColor</b><br>Color of the highest value. <i>Default: #4CAF50</i></li>
<li><b>midColor</b><br>Color of the middle value. <i>Default: #FFEB3B</i></li>
<li><b>lowColor</b><br>Color of the lowest value. <i>Default: #F44336</i></li>
<li><b>midPoint</b><br>Value representing where the middle value will be at (percentage). <i>Default: 0.5</i></li>
<li><b>opacity</b><br>Opacity of the background-color that will be set. <i>Default: 1</i></li>
<li><b>invertColorAt</b><br>Color code sums (red + green + blue) under this value will have their text color convered to white. <i>Default: 400</i></li>
<li><b>readBatchSize</b><br>Items to read in one batch before allowing browser to take control for a bit. <i>Default: 2000</i></li>
<li><b>colorBatchSize</b><br>Items colored in one batch before allowing browser to take control for a bit. <i>Default: 200</i></li>
<li><b>transition</b><br>Conditional formatting color transition speed in ms (0 = disabled). <i>Default: 0</i></li>
<li><b>callback</b><br>Allows passing a function that will be called once the coloring is finished. <i>No default value</i></li>
