"use strict"

var chars = "abcdefghijklmnopqrstufwxyz";
var freq_chars = "aaaaaaaabbcccddddeeeeeeeeeeeefffgghhhhhhiiiiiiiijkllllmmmnnnnnnnooooooooppqrrrrrrsssssstttttttttuuuffwwxyyz";
var words = [];
var word_lookup = {};
var cur_word_list = [];
var cur_word_lookup = {};
var word_word = "";
var selected_tiles = [];
var last_tile = false;

$(function (){
});

function rand_char(){
	return freq_chars.charAt(Math.floor(freq_chars.length*Math.random()));
}

function add_char(col, char){
	$(".board_colomn:nth-of-type("+col+")").prepend("<div class='board_tile' data-col='"+col+"'>"+char+"</div>");
}

function setup_board(){
	for (var i=0;i<8;i++){
		for (var j=0;j<8;j++){
			add_char(i+1, rand_char());
		}
	}
}

function startup(){
	window.click_event(".board_tile", function(){
		if ($(this).hasClass("selected")){
			if ($(this).is(last_tile)){
				$(this).removeClass("selected");
				cur_word_list.pop();
				selected_tiles.pop();
				last_tile = selected_tiles[selected_tiles.length-1];
				cur_word_lookup = word_lookup;
				for (var i=0;i<cur_word_list.length;i++){
					cur_word_lookup = cur_word_lookup[cur_word_list[i]];
				}
			}
		} else {
			if (selected_tiles.length){
				console.log(last_tile.data("col"), last_tile.index());
				if (Math.abs(last_tile.data("col") - $(this).data("col")) <= 1 && Math.abs(last_tile.index() - $(this).index()) <= 1){
					if (typeof cur_word_lookup[$(this).html()] != "undefined"){
						last_tile = $(this).addClass("selected");
						cur_word_lookup = cur_word_lookup[last_tile.html()];
						cur_word_list.push(last_tile.html());
						selected_tiles.push(last_tile);
					} else {
					
					}
				}
			} else {
				last_tile = $(this).addClass("selected");
				cur_word_lookup = word_lookup[last_tile.html()];
				cur_word_list.push(last_tile.html());
				selected_tiles.push(last_tile);
			}
		}
		if (cur_word_lookup.full){
			$("#submit").css("background", "green");
		} else {
			$("#submit").css("background", "lightgrey");
		}
		$("#cur_word").html(cur_word_list.join(""));
	}, true);
	window.click_event("#submit", function(){
		if (cur_word_lookup.full){
			for (var i=0;i<selected_tiles.length;i++){
				var tile = selected_tiles[i];
				add_char(tile.data("col"), rand_char());
				tile.remove();
			}
			$("#word_list").prepend("<div>"+cur_word_list.join("")+"</div>");
			last_tile = false;
			cur_word_lookup = {};
			cur_word_list = [];
			selected_tiles = [];
			$("#cur_word").html("");
		}
	});
	$.get("enable1.txt", function (data){
		words = data.split("\n");
		for (var i=0;i<words.length;i++){
			var word = words[i];
			var lookup_obj = word_lookup;
			for (var j=0;j<word.length-1;j++){
				var char = word.charAt(j);
				if (typeof lookup_obj[char] == "undefined")
					lookup_obj[char] = {};
				lookup_obj = lookup_obj[char];
			}
			if (words.length > 1)
				lookup_obj["full"] = true;
		}
		word_lookup["a"]["full"] = true;
		word_lookup["i"]["full"] = true;
		setup_board();
	});
	/*$.getJSON("words_dictionary.json", function (data){
		words = Object.keys(data);
		for (var i=0;i<words.length;i++){
			var word = words[i];
			var lookup_obj = word_lookup;
			for (var j=0;j<word.length;j++){
				var char = word.charAt(j);
				if (typeof lookup_obj[char] == "undefined")
					lookup_obj[char] = {};
				lookup_obj = lookup_obj[char];
			}
			if (words.length > 1)
				lookup_obj["full"] = true;
		}
		word_lookup["a"]["full"] = true;
		word_lookup["i"]["full"] = true;
		setup_board();
	});*/
}