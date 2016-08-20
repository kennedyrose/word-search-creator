var ws = {
	width: parseInt($('#opt_width').val()),
	height: parseInt($('#opt_height').val()),
	cells: this.width * this.height,
	grayed: new Array(),
	percentage: 0,
	printscreen: 0,
	lineend: 0,
	start: 0,
	completed: 0,
	startx: 0,
	starty: 0,
	startxy: 0,
	wordnum: 0,
	cell: new Array(),
	startletter: new Array(),
	stopletter: new Array(),
	solved: new Array(),
	notintable: new Array(),
	thewords: new Array(),
	startedgame: 0,
	tablebackground: "ccccff",
	lettercolor: "333333",
	foundcolor: "0000ff",
	defaultwords: "",
	
	
	// Retrieve cookies function
	getCookie: function(c_name) {
		var i,x,y,ARRcookies=document.cookie.split(";");
		for (i=0;i<ARRcookies.length;i++) {
			x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
			y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
			x=x.replace(/^\s+|\s+$/g,"");
			if (x==c_name) {
				return unescape(y);
			}
		}
	},
	// Set cookies function
	setCookie: function(c_name,value,exdays) {
		var exdate=new Date();
		exdate.setDate(exdate.getDate() + exdays);
		var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
		document.cookie=c_name + "=" + c_value;
	},
	

	// Printable screen
	printable : function() {
		$('#wordsearch td').css({ backgroundColor:'white', color:'black' });
		$('body').css({ color:'black', backgroundImage:'none' });
		$('#buttons').hide();
		$('#pbar').hide();
		$('#timer').hide();
		$('#adscreen').hide();
		alert("Press any key to return the screen back to normal.");
		this.printscreen = 1;
		
	},
	
	// Random letter function
	randLetter: function() {
		var letters = new Array("A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z");
		var randl = letters[Math.floor(Math.random()*letters.length)];
		return randl;
	},
	
	
	
	// Word placement function
	wordPlace: function(theword) {
		// Number of attempts that will be made to place a word before an error
		var attemptnum = 200;
		
		var wordlength = theword.length;
		
		// Attempt to find proper place for word
		var stopper = 0;
		var autostop = 0
		while (stopper == 0 && autostop < attemptnum) {
			// Get starting cell and direction
			var cellx = (Math.floor(Math.random() * this.width)) + 1;
			var celly = (Math.floor(Math.random() * this.height)) + 1;
			var cellxy = ((celly - 1) * this.width) + cellx;
			this.startletter[this.wordnum] = cellxy;
			var direction = Math.floor(Math.random()*8);
			
			// If horizontal forward
			if (direction === 0) {
				// If word fits
				var fits = cellx + wordlength - 1;
				if (fits <= this.width) {
				
					// Collision test
					var coltest = 0;
					var i = 1;
					var place = cellxy;
					while (i <= wordlength) {
						if (this.cell[place] && this.cell[place] != theword.charAt(i - 1))
							coltest = 1;
						place++;
						i++;
					}
					
					// Place letters in cells if nothing is colliding
					if (!coltest) {
						var i = 1;
						var place = cellxy;
						while (i <= wordlength) {
							this.cell[place] = theword.charAt(i - 1);
							this.stopletter[this.wordnum] = place;
							if (!this.grayed[this.wordnum])
								this.grayed[this.wordnum] = place;
							else
								this.grayed[this.wordnum] = this.grayed[this.wordnum] + ',' + place;
							place++;
							i++;
						}
						stopper = 1;
					}
					
				}
			}
			
			// If horizontal backward
			else if (direction === 1) {
				// If word fits
				var fits = cellx - wordlength + 1;
				if (fits > 0) {
				
					// Collision test
					var coltest = 0;
					var i = 1;
					var place = cellxy;
					while (i <= wordlength) {
						if (this.cell[place] && this.cell[place] != theword.charAt(i - 1))
							coltest = 1;
						place--;
						i++;
					}
					
					// Place letters in cells if nothing is colliding
					if (!coltest) {
						var i = 1;
						var place = cellxy;
						while (i <= wordlength) {
							this.cell[place] = theword.charAt(i - 1);
							this.stopletter[this.wordnum] = place;
							if (!this.grayed[this.wordnum])
								this.grayed[this.wordnum] = place;
							else
								this.grayed[this.wordnum] = this.grayed[this.wordnum] + ',' + place;
							place--;
							i++;
						}
						stopper = 1;
					}
				}
			}
			
			
			// If vertical forward
			else if (direction === 2) {
				var fits = celly + wordlength - 1;
				if (fits <= this.height) {
				
					// Collision test
					var coltest = 0;
					var i = 1;
					var place = cellxy;
					while (i <= wordlength) {
						if (this.cell[place] && this.cell[place] != theword.charAt(i - 1))
							coltest = 1;
						place = place + this.width;
						i++;
					}
					
					// Place letters in cells if nothing is colliding
					if (!coltest) {
						// Place letters in cells
						var i = 1;
						var place = cellxy;
						while (i <= wordlength) {
							this.cell[place] = theword.charAt(i - 1);
							this.stopletter[this.wordnum] = place;
							if (!this.grayed[this.wordnum])
								this.grayed[this.wordnum] = place;
							else
								this.grayed[this.wordnum] = this.grayed[this.wordnum] + ',' + place;
							place = place + this.width;
							i++;
						}
						stopper = 1;
					}
				}
			
			}
			
			
			// If vertical backward
			else if (direction === 3) {
				var fits = celly - wordlength + 1;
				if (fits > 0) {
				
					// Collision test
					var coltest = 0;
					var i = 1;
					var place = cellxy;
					while (i <= wordlength) {
						if (this.cell[place] && this.cell[place] != theword.charAt(i - 1))
							coltest = 1;
						place = place - this.width;
						i++;
					}
					
					// Place letters in cells if nothing is colliding
					if (!coltest) {
						var i = 1;
						var place = cellxy;
						while (i <= wordlength) {
							this.cell[place] = theword.charAt(i - 1);
							this.stopletter[this.wordnum] = place;
							if (!this.grayed[this.wordnum])
								this.grayed[this.wordnum] = place;
							else
								this.grayed[this.wordnum] = this.grayed[this.wordnum] + ',' + place;
							place = place - this.width;
							i++;
						}
						stopper = 1;
					}
				}
			
			}
			
			
			
			// If diagonal NE
			else if (direction === 4) {
				var fitsx = cellx + wordlength - 1;
				var fitsy = celly - wordlength + 1;
				if (fitsx <= this.width && fitsy > 0) {
				
					// Collision test
					var coltest = 0;
					var i = 1;
					var place = cellxy;
					while (i <= wordlength) {
						if (this.cell[place] && this.cell[place] != theword.charAt(i - 1))
							coltest = 1;
						place = (place - this.width) + 1;
						i++;
					}
					
					// Place letters in cells if nothing is colliding
					if (!coltest) {
						var i = 1;
						var place = cellxy;
						while (i <= wordlength) {
							this.cell[place] = theword.charAt(i - 1);
							this.stopletter[this.wordnum] = place;
							if (!this.grayed[this.wordnum])
								this.grayed[this.wordnum] = place;
							else
								this.grayed[this.wordnum] = this.grayed[this.wordnum] + ',' + place;
							place = (place - this.width) + 1;
							i++;
						}
						stopper = 1;
					}
				}
			}
			
			
			
			// If diagonal SW
			else if (direction === 5) {
				var fitsx = cellx - wordlength + 1;
				var fitsy = celly + wordlength - 1;
				if (fitsy <= this.height && fitsx > 0) {
				
					// Collision test
					var coltest = 0;
					var i = 1;
					var place = cellxy;
					while (i <= wordlength) {
						if (this.cell[place] && this.cell[place] != theword.charAt(i - 1))
							coltest = 1;
						place = (place + this.width) - 1;
						i++;
					}
					
					// Place letters in cells if nothing is colliding
					if (!coltest) {
						var i = 1;
						var place = cellxy;
						while (i <= wordlength) {
							this.cell[place] = theword.charAt(i - 1);
							this.stopletter[this.wordnum] = place;
							if (!this.grayed[this.wordnum])
								this.grayed[this.wordnum] = place;
							else
								this.grayed[this.wordnum] = this.grayed[this.wordnum] + ',' + place;
							place = (place + this.width) - 1;
							i++;
						}
						stopper = 1;
					}
				}
			}
			
			
			
			// If diagonal SE
			else if (direction === 6) {
				var fitsx = cellx + wordlength - 1;
				var fitsy = celly + wordlength - 1;
				if (fitsy <= this.height && fitsx <= this.width) {
				
					// Collision test
					var coltest = 0;
					var i = 1;
					var place = cellxy;
					while (i <= wordlength) {
						if (this.cell[place] && this.cell[place] != theword.charAt(i - 1))
							coltest = 1;
						place = (place + this.width) + 1;
						i++;
					}
					
					// Place letters in cells if nothing is colliding
					if (!coltest) {
						var i = 1;
						var place = cellxy;
						while (i <= wordlength) {
							this.cell[place] = theword.charAt(i - 1);
							this.stopletter[this.wordnum] = place;
							if (!this.grayed[this.wordnum])
								this.grayed[this.wordnum] = place;
							else
								this.grayed[this.wordnum] = this.grayed[this.wordnum] + ',' + place;
							place = (place + this.width) + 1;
							i++;
						}
						stopper = 1;
					}
				}
			}
			
			
			
			// If diagonal NW
			else if (direction === 7) {
				var fitsx = cellx - wordlength + 1;
				var fitsy = celly - wordlength + 1;
				if (fitsy > 0 && fitsx > 0) {
				
					// Collision test
					var coltest = 0;
					var i = 1;
					var place = cellxy;
					while (i <= wordlength) {
						if (this.cell[place] && this.cell[place] != theword.charAt(i - 1))
							coltest = 1;
						place = (place - this.width) - 1;
						i++;
					}
					
					// Place letters in cells if nothing is colliding
					if (!coltest) {
						var i = 1;
						var place = cellxy;
						while (i <= wordlength) {
							this.cell[place] = theword.charAt(i - 1);
							this.stopletter[this.wordnum] = place;
							if (!this.grayed[this.wordnum])
								this.grayed[this.wordnum] = place;
							else
								this.grayed[this.wordnum] = this.grayed[this.wordnum] + ',' + place;
							place = (place - this.width) - 1;
							i++;
						}
						stopper = 1;
					}
				}
			}
			autostop++;
		} // End stopper loop
		// If word could not be placed
		if (autostop == attemptnum) {
			this.notintable.push(theword);
		}
		this.wordnum++;
	}, // End wordPlace()
	
	
	
	

	// Sorts array by string length
	sortByLengthDesc: function(a, b) {
		if (a.length > b.length)
		return -1;
		if (a.length < b.length)
		return 1;
		return 0;
	},


	// Gets rid of circle graphics
	clearGrid: function() {
		var h = this.width * this.height;
		while (h) {
			$('#' + h).css("background-image", "");
			h--;
		}
	},



	// Starts line
	startLine: function(b) {
		$('#' + b).css("background-image", "url('img/c.png')");
		linestart = b;
		
		// Get XY coordinates
		this.startx = b;
		this.starty = 1;
		while (this.startx > this.width) {
			this.startx = this.startx - this.width;
			this.starty++;
		}
		this.startxy = ((this.starty - 1) * this.width) + this.startx;

	},





	// Explosion effect
	fx: function(o) {
		var $o = $(o);

		$o.html($o.text().replace(/([\S])/g, "<span>$1</span>"));
		$o.css("position", "relative");
		$("span", $o).each(function(i) {
			var newTop = Math.floor(Math.random()*500)*((i%2)?1:-1);
			var newLeft = Math.floor(Math.random()*500)*((i%2)?1:-1);

			$(this).css({position: "relative",
				opacity: 1,
				top: 0,
				left: 0
			}).animate({
				opacity: 0,
				top: newTop,
				left:newLeft
			},2000);
		});
	},


	// Fixes issues with mousedown in table, then mouseup out of table
	outOfGrid: function() {
		// Reset
		linestart = 0;
		this.lineend = 0;
		this.clearGrid();

	},


	// Ends circle line
	endLine: function(c) {
		// Loop for each word
		var k = 0;
		var allsolved = 0;
		for(k = 0; k < this.thewords.length; k++) {
		
			
			var foundword = 0;
			if (linestart == this.startletter[k] && this.lineend == this.stopletter[k])
				foundword = 1;
			if (linestart == this.stopletter[k] && this.lineend == this.startletter[k])
				foundword = 1;
			
			// If word is found
			if (foundword) {
				// Strike through word
				$('#list' + k).css('text-decoration', 'line-through');
				this.solved[k] = 1;
				
				// Color found word
				var splitresult = new Array();
				splitresult = this.grayed[k].split(",");
				var l = 0;
				for(l = 0; l < splitresult.length; l++) {
					$('#' + splitresult[l]).css('color', this.foundcolor);
				}
				
				
			}
			
			
			
			if (this.solved[k] == 1) {
				allsolved++;
			}
			
			
			// Update progress bar
			this.percentage = (allsolved / (this.thewords.length - this.notintable.length)) * 100;
			this.percentage = Math.round(this.percentage);
			$('#pb1').progressBar(this.percentage);
				
		}
		
		// If all words have been found
		// Disable for IE, doesn't work
		if (allsolved == (this.thewords.length - this.notintable.length)) {
			if (!$.browser.msie) {
				if (!this.completed) {
					var s = 1;
					var oldcell = new Array();
					while (s <= this.cells) {
						oldcell[s] = $('#false' + s).html();
						this.fx('#false' + s);
						s++;
					}
				}
			}
			this.completed = 1;
		}
		
		
		// Reset
		linestart = 0;
		this.lineend = 0;
		this.clearGrid();
	},


	// When mouse enters new cell
	enterLine: function(d) {
		var newx = 0;
		var newy = 0;
		this.clearGrid();
		var linexy = 0;
		if (linestart) {
			// Get XY coordinates
			newx = d;
			newy = 1;
			while (newx > this.width) {
				newx = newx - this.width;
				newy++;
			}
			// If mouse is NW
			if (this.startx > newx && this.starty > newy) {
				$('#' + linestart).css("background-image", "url('img/nw.png')");
				linexy = this.startxy - this.width - 1;
				while (linexy >= d) {
					$('#' + linexy).css("background-image", "url('img/se.png')");
					this.lineend = linexy;
					$('#' + (linexy + 1)).css("background-image", "url('img/c-sw.png')");
					$('#' + (linexy + this.width)).css("background-image", "url('img/c-ne.png')");
					if (((linexy + this.width) + 1) != this.startxy)
						$('#' + ((linexy + this.width) + 1)).css("background-image", "url('img/down.png')");
					linexy = linexy - this.width - 1;
				}
				
				
				
			}
			// If mouse is SE
			if (this.startx < newx && this.starty < newy) {
				$('#' + linestart).css("background-image", "url('img/se.png')");
				linexy = this.startxy + this.width + 1;
				while (linexy <= d) {
					$('#' + linexy).css("background-image", "url('img/nw.png')");
					this.lineend = linexy;
					$('#' + (linexy - 1)).css("background-image", "url('img/c-ne.png')");
					$('#' + (linexy - this.width)).css("background-image", "url('img/c-sw.png')");
					if (((linexy - this.width) - 1) != this.startxy)
						$('#' + ((linexy - this.width) - 1)).css("background-image", "url('img/down.png')");
					linexy = linexy + this.width + 1;
				}
			}
			// If mouse is SW
			if (this.startx > newx && this.starty < newy) {
				$('#' + linestart).css("background-image", "url('img/sw.png')");
				linexy = this.startxy + this.width - 1;
				while (linexy <= d) {
					$('#' + linexy).css("background-image", "url('img/up.png')");
					
					$('#' + (linexy + 1)).css("background-image", "url('img/c-nw.png')");
					$('#' + (linexy - this.width)).css("background-image", "url('img/c-se.png')");
					if (((linexy - this.width) + 1) != this.startxy)
						$('#' + ((linexy - this.width) + 1)).css("background-image", "url('img/up.png')");
					
					$('#' + linexy).css("background-image", "url('img/ne.png')");
					this.lineend = linexy;
					linexy = linexy +  this.width - 1;
				}
			}
			// If mouse is NE
			if (this.startx < newx && this.starty > newy) {
				$('#' + linestart).css("background-image", "url('img/ne.png')");
				linexy = this.startxy - this.width + 1;
				while (linexy >= d) {
					
					$('#' + (linexy - 1)).css("background-image", "url('img/c-se.png')");
					this.lineend = linexy;
					$('#' + (linexy + this.width)).css("background-image", "url('img/c-nw.png')");
					if (((linexy + this.width) - 1) != this.startxy)
						$('#' + ((linexy + this.width) - 1)).css("background-image", "url('img/up.png')");
					
					$('#' + linexy).css("background-image", "url('img/sw.png')");
					
					
					
					linexy = linexy -  this.width + 1;
				}
			}
			
			
			// If mouse is above
			if (this.startx == newx && this.starty > newy) {
				$('#' + linestart).css("background-image", "url('img/n.png')");
				$('#' + d).css("background-image", "url('img/s.png')");
				this.lineend = d;
				
				// Fill in line along the way
				linexy = this.startxy - this.width;
				while (linexy > d) {
					$('#' + linexy).css("background-image", "url('img/v.png')");
					linexy = linexy - this.width;
				}
				
			}
			// If mouse is right
			if (this.starty == newy && this.startx < newx) {
				$('#' + linestart).css("background-image", "url('img/e.png')");
				$('#' + d).css("background-image", "url('img/w.png')");
				this.lineend = d;
				
				// Fill in line along the way
				linexy = this.startxy + 1;
				while (linexy < d) {
					$('#' + linexy).css("background-image", "url('img/h.png')");
					linexy = linexy + 1;
				}
				
			}
			// If mouse is below
			if (this.startx == newx && this.starty < newy) {
				$('#' + linestart).css("background-image", "url('img/s.png')");
				$('#' + d).css("background-image", "url('img/n.png')");
				this.lineend = d;
				
				// Fill in line along the way
				linexy = this.startxy + this.width;
				while (linexy < d) {
					$('#' + linexy).css("background-image", "url('img/v.png')");
					linexy = linexy + this.width;
				}
			}
			// If mouse is left
			if (this.starty == newy && this.startx > newx) {
				$('#' + linestart).css("background-image", "url('img/w.png')");
				$('#' + d).css("background-image", "url('img/e.png')");
				this.lineend = d;
				
				// Fill in line along the way
				linexy = this.startxy - 1;
				while (linexy > d) {
					$('#' + linexy).css("background-image", "url('img/h.png')");
					linexy = linexy - 1;
				}
			}
			
			
			
		}
	},



	wordSearch: function(wordlist) {
		var wordlist = wordlist.split(',');
		var alertstring = "";
		
		var q = 0;
		for (q = 0; q < wordlist.length; q++) {
			this.wordPlace(wordlist[q]);
		}
		
		// Display error for words not placed
		if (this.notintable[0]) {
			alertstring = "The following words could not be placed on the word search:\n\n";
			var r = 0;
			for (r = 0; r < this.notintable.length; r++) {
				alertstring = alertstring + this.notintable[r] + '\n';
				
			}
			alertstring = alertstring + "\nTry enlarging the size of the word search, or reducing the amount of words.";
			alert(alertstring);
		}
		
		// Fill in each empty cell with random letter
		var c = 1;
		while (c <= this.cells) {
			if (!this.cell[c]) {
				this.cell[c] = "@";
			}
			c++;
		}

		// Create wordsearch table
		var c = 1;
		var rowcount = 1;
		var tf = "";
		var wordtable = '<table border="0" id="wordsearch" cellpadding="0" cellspacing="0" style="background-color:#' + this.tablebackground + ';color:#' + this.lettercolor +'" onselectstart="return false">';
		while (c <= this.cells) {
			if (rowcount == 1) {
				wordtable += '<tr>';
			}
			if (this.cell[c] == "@") {
				tf = "false";
				this.cell[c] =  this.randLetter();
				// for debugging
				//this.cell[c] =  "-";
			}
			else {
				tf = "true";
			}
			wordtable += '<td id="' + c + '" onmousedown="ws.startLine(' + c +')" onmouseup="ws.endLine(' + c +')" onmouseover="ws.enterLine(' + c +')"><span id="' + tf + c + '">' + this.cell[c].toUpperCase() + '</span></td>';
			if (rowcount == this.width) {
				wordtable += '</tr>';
				rowcount = 0;
			}
			c++;
			rowcount++;
		}
		wordtable += '</table></center>';
		
		return wordtable;
		
	},


	startGame: function() {
		this.width = $('#opt_width').val();;
		this.height = $('#opt_height').val();;
		this.width = parseInt(this.width);
		this.height = parseInt(this.height);
		
		
		this.cells = this.width * this.height;
		
		this.startedgame = 1;
		this.start = new Date().getTime(), elapsed = '0.0';
		
		// Disable selecting
		$('body').css({ '-webkit-touch-callout':'none', '-webkit-user-select':'none', '-khtml-user-select':'none', '-moz-user-select':'none', '-ms-user-select':'none', 'user-select':'none' });
		


		// Get options
		this.thewords = [];
		this.thewords = $('#opt_words').val();
		this.thewords = this.thewords.split("\n");

		if ($('#opt_bar').is(":checked"))
			$('#pbar').show();
		else
			$('#pbar').hide();

		if ($('#opt_timer').is(":checked"))
			$('#timer').show();
		else
			$('#timer').hide();
		



		this.thewords = this.thewords.sort(this.sortByLengthDesc);
		var thelist = "";
		var thetable = this.wordSearch(this.thewords.join());
		
		// If word is in table, display on list
		var j = 0;
		for(j = 0; j < this.thewords.length; j++) {
			if (jQuery.inArray(this.thewords[j], this.notintable) == -1)
				thelist += '<span id="list' + j + '">' + this.thewords[j] + '</span><br />';
		}
		
		
		$('#wordsearch').html(thetable);
		$('#wordlist').html(thelist);
		
		
		
		$('#startscreen').hide('slow');
		$('#wordscreen').show('slow');
		
		
	},





	// If progress bar value is changed
	barChange: function() {
		if ($('#opt_bar:checked').val() !== undefined) {
			ws.setCookie("ws_bar", "on", "365");
		}
		else {
			ws.setCookie("ws_bar", "off", "365");
		}

	},


	// If timer value is changed
	timerChange: function() {
		if ($('#opt_timer:checked').val() !== undefined) {
			ws.setCookie("ws_timer", "on", "365");
		}
		else {
			ws.setCookie("ws_timer", "off", "365");
		}

	}

	
	
};




// Timer function
window.setInterval(function()  { 
	var displaysec = 0;
	var displaymin = 0; 
	if (ws.startedgame == 1) {
		var time = new Date().getTime() - ws.start;  
		elapsed = Math.floor(time / 100) / 10;  
		if(Math.round(elapsed) == elapsed) { elapsed += '.0'; }
		if (ws.completed == 0) {
			displaysec = Math.floor(elapsed);
			displaymin = Math.floor(displaysec / 60)
			while (displaysec >= 60) {
				displaysec = displaysec - 60;
			}
			if (displaysec < 10) {
				displaysec = "0" + displaysec;
			}
			$('#timer').html(displaymin + ":" + displaysec);
			
		}
	}
}, 100);






// Keypress to get rid of printable screen
$(document).keypress(function(e) {
	if (ws.printscreen == 1) {
		$('#wordsearch td').css({ backgroundColor:'#' + ws.tablebackground, color:'#' + ws.lettercolor });
		
		$('body').css({ color:'#333', backgroundImage:'url(\'img/bg.jpg\')' });
		
		$('#buttons').show();
		if ($('#opt_bar').is(":checked"))
			$('#pbar').show();
		if ($('#opt_timer').is(":checked"))
			$('#timer').show();
		$('#adscreen').show();
	
		ws.printscreen = 0;
	}

});


$(document).ready(function() {
	var tablebackground = "ccccff";
	if (ws.getCookie('ws_tablebackground')) {
		tablebackground = ws.getCookie('ws_tablebackground');
	}
	
	var lettercolor = "333333";
	if (ws.getCookie('ws_lettercolor')) {
		lettercolor = ws.getCookie('ws_lettercolor');
	}
	
	var foundcolor = "0000ff";
	if (ws.getCookie('ws_foundcolor')) {
		foundcolor = ws.getCookie('ws_foundcolor');
	}

	$('#p1').css("background-color", "#" + tablebackground);
	$('#p2').css("background-color", "#" + lettercolor);
	$('#p3').css("background-color", "#" + foundcolor);

	if (ws.getCookie('ws_list'))
		$('#opt_words').val(ws.getCookie('ws_list'));
	else
		$('#opt_words').val(ws.defaultwords.join('\n'));
	if (ws.getCookie('ws_width'))
		$('#opt_width').val(ws.getCookie('ws_width'));
	if (ws.getCookie('ws_height'))
		$('#opt_height').val(ws.getCookie('ws_height'));
		
		
	if (ws.getCookie('ws_bar') == "on")
		$('#opt_bar').prop('checked', true);
	if (ws.getCookie('ws_bar') == "off")
		$('#opt_bar').prop('checked', false);
		
	if (ws.getCookie('ws_timer') == "on")
		$('#opt_timer').prop('checked', true);
	if (ws.getCookie('ws_timer') == "off")
		$('#opt_timer').prop('checked', false);
		
		
		
		
	$("#pb1").progressBar();
	
	// Button rollovers
	$("#btn_start").hover(
		function() { this.src = this.src.replace("img/start1.png", "img/start0.png"); },
		function() { this.src = this.src.replace("img/start0.png", "img/start1.png"); }
	);
	$("#btn_new").hover(
		function() { this.src = this.src.replace("img/new1.png", "img/new0.png"); },
		function() { this.src = this.src.replace("img/new0.png", "img/new1.png"); }
	);
	$("#btn_reload").hover(
		function() { this.src = this.src.replace("img/reload1.png", "img/reload0.png"); },
		function() { this.src = this.src.replace("img/reload0.png", "img/reload1.png"); }
	);
	$("#btn_printable").hover(
		function() { this.src = this.src.replace("img/printable1.png", "img/printable0.png"); },
		function() { this.src = this.src.replace("img/printable0.png", "img/printable1.png"); }
	);
	
	// Get ads
	$.get('ad.txt', function(data) {
		$('#adscreen').append(data);
	});
	
		
	// Ditch loading screen
	$('#loadscreen').hide();
	$('#startscreen').show();
	$('#adscreen').show();
	
});