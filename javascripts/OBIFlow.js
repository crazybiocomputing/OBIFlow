/*
 *  OBIFlow: Omics and Bioinformatics visual programming workflow
 *  Copyright (C) 2016  Jean-Christophe Taveau.
 *
 *  This file is part of OBIFlow
 *
 * This program is free software: you can redistribute it and/or modify it
 * under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with mowgli.  If not, see <http://www.gnu.org/licenses/>.
 *
 *
 * Authors:
 * Jean-Christophe Taveau, Kristina Kastano, Savandara Besse
 */


(function(exports) {

    function Input(x) {
        this.__value = x;
    }

    Input.of = function(data) {
        return new Input(data);
    }

    /**
     * log :: Display results in console
     *
     */
    Input.prototype.log = function() {
        console.log(JSON.stringify(this.__value) );
    }

    /**
     * map :: Obj -> Obj
     *
     */
    Input.prototype.map = function(func) {
        return Input.of(func(this.__value));
    }

    /**
     * split :: String -> [String]
     *
     */
    Input.prototype.split = function(separator) {
        var result = {title: this.__value.title};
        result.data = this.__value.data.split(separator);
        return Input.of(result);
    }
    
    /**
     * splitWord :: String -> [String]
     *
     */
    Input.prototype.splitWord = function(length) {
        var result = {title: this.__value.title};
        var regex = new RegExp('.{'+length+'}','g');
        result.data = this.__value.data.match(regex);
        
        return Input.of(result);
    }
    

    /**
     * toLowerCase :: String -> String
     *
     */
    Input.prototype.toLowerCase = function() {
        var result = {title: this.__value.title};
        result.data = this.__value.data.toLowerCase();
        return new Input(result);
    }


    /**
     *
     * E M B O S S 
     *
     */
    
    /**
    * hydropathy :: Obj -> Obj
    * 
    */
    Input.prototype.hydropathy = function(settings){
	var slidingWindow = settings.slidingWindow;
	var halfWindow =  Math.floor(slidingWindow /2);
        var result = this.__value.data
            .toLowerCase()
            .split('')                                                    // <- Convert {string} into {array}
            .map(
                (x,i,array) => array.slice(i-halfWindow,i+1+halfWindow)
            )
            .filter(
                (x) => ((x.length === slidingWindow) ? true : false)        // Only get arrays of length window
            )
	   .map(
	       x =>  Math.round(x.reduce( (total, aa) => total + Math.floor(BIO.alphabet.hydropathy_scores(aa)), 0 )/slidingWindow*100)/100
     )            // Returns mean of the window's amino acids' hydropathy

        return Input.of(result);
    }
    
    
    /**
    * threeToOne :: Obj -> Obj
    *
    */		
    Input.prototype.threeToOne = function() {
        var result = {title: this.__value.title} 
        result.data = this.__value.data
            .map(
                (x) => BIO.alphabet.amino(x.slice(0,-1)) // slice used to remove the space : "ala " -> "ala"
	    )
	    .join('').toUpperCase();
            
        return Input.of(result);
    }
    
    /**
     * revseq :: Obj -> Obj 
     * 
     */
    
    Input.prototype.revseq = function() {
    	var result = {title: this.__value.title};
        result.data = this.__value.data
		.reduce(
			(accu,x) => {accu.unshift(BIO.alphabet.complementNucleic(x));return accu;},
		[])
    		.join('');
    	return Input.of(result);
    };
    
    /**
     * tm :: Obj -> Number
     * 
     */
     Input.prototype.tm = function () {
     	var result = {title:this.__value.title};
	result.data = this.__value.data;
	var tm = this.__value.data
		.reduce(
                (accu,x) => {accu[x]++; return accu;},
                {a:0, t:0, g:0, c:0}
            	);
	
		if (result.data.length < 14) {
			var tmCalcul = (tm.a+tm.t)*2+(tm.g+tm.c)*4;
			return Input.of(Math.round(tmCalcul*100)/100);
		}
		else {
			var tmCalcul = 64.9 + 41*(tm.g + tm.c - 16.4) / result.data.length;
			return Input.of(Math.round(tmCalcul*100)/100);
		}
     };

    /**
    * wordcount :: Obj -> Obj
    *
    */
    Input.prototype.wordcount = function(settings) {
        // settings.word_length
        // TODO
        return Input.of(this.__value);
    }

    exports.Input = Input;
    
})(this.BIO = this.BIO || {} );



/*
 *  OBIFlow: Omics and Bioinformatics visual programming workflow
 *  Copyright (C) 2016  Jean-Christophe Taveau.
 *
 *  This file is part of OBIFlow
 *
 * This program is free software: you can redistribute it and/or modify it
 * under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with mowgli.  If not, see <http://www.gnu.org/licenses/>.
 *
 *
 * Authors:
 * Jean-Christophe Taveau
 */


var BIO = BIO || {};

BIO.alphabet = {};

BIO.alphabet.amino = function(symbol) {
        return {
            'a':'ala', 'ala':'a',
            'r':'arg', 'arg':'r',
            'n':'asn', 'asn':'n',
            'd':'asp', 'asp':'d',
            'c':'cys', 'cys':'c',
            'q':'gln', 'gln':'q',
            'e':'glu', 'glu':'e',
            'g':'gly', 'gly':'g',
            'h':'his', 'his':'h',
            'i':'ile', 'ile':'i',
            'l':'leu', 'leu':'l',
            'k':'lys', 'lys':'k',
            'm':'met', 'met':'m',
            'f':'phe', 'phe':'f',
            'p':'pro', 'pro':'p',
            's':'ser', 'ser':'s',
            't':'thr', 'thr':'t',
            'w':'trp', 'trp':'w',
            'y':'tyr', 'tyr':'y',
            'v':'val', 'val':'v',
            'b':'asx', 'asx':'b', 
            'z':'glx', 'glx':'z', 
            'x':'xxx', 'xxx':'x'
        }[symbol];
};

/* Kyte-Doolittle scale */
BIO.alphabet.hydropathy_scores = function(symbol){
    return {
	'i' : 4.5,
	'v' : 4.2,
	'l' : 3.8,
	'f' : 2.8,
	'c' : 2.5,
	'm' : 1.9,
	'a' : 1.8,
	'g' : -0.4,
	't' : -0.7,
	'w' : -0.9,
	's' : -0.8,
	'y' : -1.3,
	'p' : -1.6,
	'h' : -3.2,
	'e' : -3.5,
	'q' : -3.5,
	'd' : -3.5,
	'n' : -3.5,
	'k' : -3.9,
	'r' : -4.5
    }[symbol]
};

BIO.alphabet.nucleic = function(symbol) {
};

BIO.alphabet.complementNucleic = function(symbol) {
	return {
		't':'a', 
		'a':'t',
		'c':'g', 
		'g':'c'	
	}[symbol];
};

/*
 *  OBIFlow: Omics and Bioinformatics visual programming workflow
 *  Copyright (C) 2016  Jean-Christophe Taveau.
 *
 *  This file is part of OBIFlow
 *
 * This program is free software: you can redistribute it and/or modify it
 * under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with mowgli.  If not, see <http://www.gnu.org/licenses/>.
 *
 *
 * Authors:
 * Jean-Christophe Taveau
 */

function Board(div_name,w,h) {

    this.name = div_name;
    this.height = h;
    this.width  = w;
    this.cells  = new Array(w * h);
    this.cells.fill(0);
    this.viewport = {w: w, h: h};
    this.tokens = [];

}

Board.prototype.getHTMLElement = function() {
    return document.getElementById(this.name);
};


Board.prototype.setViewport = function (w,h) {
    this.viewport.w = w;
    this.viewport.h = h;
}

Board.prototype.addToken = function(options) {
    var newTok = TokenFactory.get(options);
    
    newTok.cell_x = 0;
    newTok.cell_y = 0;

    document.getElementById(this.name).appendChild(newTok.html);

    newTok.init();
    this.tokens.push(newTok);
    // Update sandbox
    game.sandbox.refill(newTok);
}

Board.prototype.init = function () {
    // TODO
    document.getElementById(this.name).setAttribute("style",'width:'  + (this.viewport.w * Game.TOKENSIZE) + 'px'); 
    document.getElementById(this.name).setAttribute("style",'height:' + (this.viewport.h * Game.TOKENSIZE) + 'px');

}

Board.prototype.render = function () {
    // TODO

}

/*
 *  OBIFlow: Omics and Bioinformatics visual programming workflow
 *  Copyright (C) 2016  Jean-Christophe Taveau.
 *
 *  This file is part of OBIFlow
 *
 * This program is free software: you can redistribute it and/or modify it
 * under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with mowgli.  If not, see <http://www.gnu.org/licenses/>.
 *
 *
 * Authors:
 * Jean-Christophe Taveau
 */

function Game(div_name) {
    this.name = div_name;
    this.components = [];
    this.board;
    this.sandbox;
}

Game.TOKENSIZE = 80;

Game.HOME_FLOW = function () {
    return '../';
};


Game.prototype.add = function (component) {
    if (component instanceof Board) {
        this.board = component;
    }
    else if (component instanceof SandBox) {
        this.sandbox = component;
    }
    
    this.components.push(component);
}

Game.prototype.init = function () {
    this.components.forEach(function(el) {el.init();});
}

Game.prototype.render = function () {
    this.components.forEach(function(el) {el.render();});
}

/*
 *  OBIFlow: Omics and Bioinformatics visual programming workflow
 *  Copyright (C) 2016  Jean-Christophe Taveau.
 *
 *  This file is part of OBIFlow
 *
 * This program is free software: you can redistribute it and/or modify it
 * under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with mowgli.  If not, see <http://www.gnu.org/licenses/>.
 *
 *
 * Authors:
 * Jean-Christophe Taveau
 */


function Graph() {

}

/**
 * Get Graph in Newick format
 *
 * @returns {string}
 */
Graph.prototype.getGraph = function(root) {
    for (var i in tokens) {
      tokens[i].done = false;
    }

    var graph = getBranch(root);
    console.log('GRAPH '+graph);
    return graph;
}

Graph.prototype.getBranch = function(node) {
    node.done=true;
    var branch=node.ID+':'+node.status;
    var children = getChildren(node);
    if (children.length <= 0) {
         return branch;
    }
    // else
    branch += '(';
    for (var i=0;i<children.length;i++) {
      branch+=getBranch(tokens[children[i]]);
      if ( i != (children.length-1) )
        branch += ',';
    }
    branch +=')';
    return branch;
}

Graph.prototype.getChildren = function(node) {
    var children=[];
    for (i=0;i<4;i++) {
      if (node.knots[i].toUpperCase()==node.knots[i]) {
        j=(i + node.angle/90)%4;
        var n=neighbors[j];
        var the_id=board.cells[node.cell_x + n.dx + (node.cell_y+n.dy)*board.width];
        if (!tokens[the_id].done)
          children.push(the_id);
      }
    }
    children.sort();
    return children;
}


Graph.prototype.alphabet = 'aA0bB1cC2dD3eE4fF5gG6hH7iI8jJ9kK/lL.mM,nN(oO)pP:qQ<rR>sS tT_uU!vV-wW"xX;yYzZ';



Graph.prototype.encode = function(str) {
    // Seed used for the encryption
    var key = (function () {
        var words = window.location.pathname.split('/').slice(2);
        return words.join('/');
    })();
    console.log('KEY '+key );
    var out='';
    for (var i=0;i<str.length;i++) {
        char = alphabet.indexOf(str[i]);
        shift= alphabet.indexOf(key[i%key.length]);
        out += alphabet[(char+shift)%alphabet.length];
    }
    return out;
 }

Graph.prototype.decode = function(str) {
    // Seed used for the decoding 
    var key = (function () {
        var words = window.location.pathname.split('/').slice(2);
        return words.join('/');
    })();
    console.log('KEY '+key + ' '+ window.location.pathname);

    var out='';
    for (var i=0;i<str.length;i++) {
      char=alphabet.indexOf(str[i]);
      shift=alphabet.indexOf(key[i%key.length]);
      if (char-shift < 0) char+=alphabet.length;
      out+=alphabet[(char-shift)%alphabet.length];
    }
    return out;
  }

Graph.prototype.saveStatus = function(str) {
    var status='';
    for (var i=0;i< document.forms['form_'+str].elements.length;i++) {
        if (document.forms['form_'+str].elements[i].type=="radio" && document.forms['form_'+str].elements[i].checked) {
            status += document.forms['form_'+str].elements[i].name+'['
                    + document.forms['form_'+str].elements[i].value+";"
                    + document.forms['form_'+str].elements[i].checked+']';
        }
        else if (document.forms['form_'+str].elements[i].type=="checkbox"){
            status += document.forms['form_'+str].elements[i].name+'['
                    + document.forms['form_'+str].elements[i].checked+']';
        }
        else if (document.forms['form_'+str].elements[i].type!="radio"){
            status += document.forms['form_'+str].elements[i].name+'['
                    + document.forms['form_'+str].elements[i].value+']';
        }
    }
    tokens[str].status=status;
    // Close popup
    document.getElementById('popup').innerHTML='';

  }

Graph.prototype.readStatus = function(str) {
    var status=tokens[str].status;
    if (status != 0) {
        var arr=status.split(']');
        for (var i=0;i<arr.length-1;i++) {
            var names=arr[i].split(/[\[;]+/ );
            //console.log('readStatus['+i+"] of "+str+"->"+status+" " +arr+'->'+names[0]+'='+names[1]+'='+names[2]);

            if (names.length==3 && names[2]=='true') {
                document.forms['form_'+str].elements[names[0]][names[1]].checked = true;
            }
            else if (names[1]=='false' || names[1]=='true') {
                document.forms['form_'+str].elements[names[0]].checked=(names[1]=='true') ? true : false;
            }
            else {
                // Wildcards :;[]
                var v = names[1].replace('←',':');
                document.forms['form_'+str].elements[names[0]].value=v;
            }
        }
    }
}


Graph.prototype.printGraphDebug = function(tok,graph) {
    var el = document.getElementById('debug');
    var str='<p>'+tok.nodes+'</p>';
    var str='<p>'+encode(getGraph(tok))+'</p>';
    var str='<p>'+getGraph(tok)+'</p>';
    el.innerHTML=str;
}

/*
 *  OBIFlow: Omics and Bioinformatics visual programming workflow
 *  Copyright (C) 2016  Jean-Christophe Taveau.
 *
 *  This file is part of OBIFlow
 *
 * This program is free software: you can redistribute it and/or modify it
 * under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with mowgli.  If not, see <http://www.gnu.org/licenses/>.
 *
 *
 * Authors:
 * Jean-Christophe Taveau
 */

function Popup(div_name) {

    this.name = div_name;

}

Popup.prototype.addContent = function() {
    return document.getElementById(this.name);
};


Popup.prototype.getHTMLElement = function() {
    return document.getElementById(this.name);
};

Popup.prototype.init = function () {
    // TODO
    var self = this;
    var el = document.getElementById(this.name); 
    
    // Close button
    var closeB = document.querySelector('#' + this.name + ' .titlebar #close');
    closeB.addEventListener(
        'click',
        function(ev) {
            document.getElementById(self.name).style.display = 'none';
        }
    );
    
    // Titlebar
    var titlebar = document.querySelector('#' + this.name + ' .titlebar');
    titlebar.addEventListener(
        'mousedown',
        function(ev) {
            // TODO;
        }
    );

    titlebar.addEventListener(
        'mousemove',
        function(ev) {
            // TODO;
        }
    );

    titlebar.addEventListener(
        'mouseup',
        function(ev) {
            // TODO;
        }
    );

}

Popup.prototype.render = function () {
    // TODO

}

/*
 *  OBIFlow: Omics and Bioinformatics visual programming workflow
 *  Copyright (C) 2016  Jean-Christophe Taveau.
 *
 *  This file is part of OBIFlow
 *
 * This program is free software: you can redistribute it and/or modify it
 * under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with mowgli.  If not, see <http://www.gnu.org/licenses/>.
 *
 *
 * Authors:
 * Jean-Christophe Taveau
 */

function SandBox(div_name) {
    this.name = div_name;
    this.element = document.getElementById(this.name);
    /*
    this.width  = Math.min(max_tokens,Math.max(3,num) );
    this.height = Math.ceil(num/sandbox.width);
    this.element.style.width  = sandbox.width  * TOKENSIZE;
    this.element.style.height = sandbox.height * TOKENSIZE;
    */
    this.tokens = [];
    
}

SandBox.allTokens = [
    {type: 'biotools'     , copies: 10, current: 0},
    {type: 'calcArray'    , copies: 10, current: 0},
    {type: 'calcNumber'   , copies: 10, current: 0},
    {type: 'calcString'   , copies: 10, current: 0},
    {type: 'database'     , copies: 10, current: 0},
    {type: 'filter'       , copies: 10, current: 0},
    {type: 'fold'         , copies: 10, current: 0},
    {type: 'function'     , copies: 10, current: 0},
    {type: 'hub'          , copies: 10, current: 0},
    {type: 'if_then_else' , copies: 10, current: 0},
    {type: 'input_cloud'  , copies: 10, current: 0},
    {type: 'input_new'    , copies: 10, current: 0},
    {type: 'input_ro'     , copies: 10, current: 0},
    {type: 'input_rw'     , copies: 10, current: 0},
    {type: 'input_start'  , copies: 1 , current: 0},
    {type: 'map'          , copies: 10, current: 0},
    {type: 'return_filter', copies: 10, current: 0},
    {type: 'return_fold'  , copies: 10, current: 0},
    {type: 'return_map'   , copies: 10, current: 0},
    {type: 'settings'     , copies: 10, current: 0},
    {type: 'search'       , copies: 10, current: 0},
    {type: 'view'         , copies: 1 , current: 0},
    {type: 'view_plot'    , copies: 1 , current: 0}
];

SandBox.prototype.addTokens = function(toks) {
    var tokSet = toks;
    if (toks[0].type.toLowerCase() === 'all') {
        tokSet = SandBox.allTokens;
    }
    
    this.tokens = tokSet.map(
        function(token) {
            var myTok = TokenSandBoxFactory.get(token);
            return {token: myTok, copies: token.copies, current: token.current};
        }
    );

    console.log(this.tokens);
};

SandBox.prototype.init = function() {
    var self = this;

    this.tokens.forEach(
        function (tok,index,array) {
            console.log('init Child');
            console.log(self.element);
            self.element.appendChild(tok.token.html);
            tok.token.init();
        }
    );
};


SandBox.prototype.refill = function(tok) {
    var i = 0;
    var len = this.tokens.length;
    console.log('refill');
    
    while (i < len) {
        console.log(i);
        if (tok.type === this.tokens[i].token.type) {
            this.tokens[i].current++;
            this.tokens[i].copies--;
            this.tokens[i].token.current++;
            if (this.tokens[i].copies <= 0) {
                this.tokens[i].token.getHTMLElement().style.display = 'none';
            }
            console.log(JSON.stringify(this.tokens[i]));
            // TODO
            // Move tok to board - a copy??
            // Refill sandbox with default token of the same type
            //this.tokens.push({type: tok.type}TokenFactory.get(this.tokens[i].token));
        }
        i++;
    }
};

SandBox.prototype.render = function() {
    var self = this;
    this.tokens.forEach(
        function (tok) {
            console.log('append Child');
            console.log(this.element);
            console.log(tok.token.html);
            self.element.appendChild(tok.token.html);
        }
    );
};



/*
 *  OBIFlow: Omics and Bioinformatics visual programming workflow
 *  Copyright (C) 2016  Jean-Christophe Taveau.
 *
 *  This file is part of OBIFlow
 *
 * This program is free software: you can redistribute it and/or modify it
 * under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with mowgli.  If not, see <http://www.gnu.org/licenses/>.
 *
 *
 * Authors:
 * Jean-Christophe Taveau
 */

function Token(options) {
    // Init
    this.ID = options.ID || 'UNK__TOK';
    this.type = options.type || 'unknown';
    this.name = options.name || 'unknown';
    this.description = options.description  || {title:'None',contents:''};
    this.title = options.title || 'No title';
    this.props = options.props || (Token.CLOSABLE | Token.CONTAINABLE | Token.LINKABLE | Token.MOVABLE | Token.RENDERABLE | Token.ROTATABLE);
    this.status = -1;
    this.weight = 1;
    this.type = options.type || 'X';

    // Geometry and Board location
    this.orgx = options.orgx || 0;
    this.orgy = options.orgy || 0;
    this.width = options.width || Game.TOKENSIZE;
    this.height = options.height || Game.TOKENSIZE;
    this.cell_x = (options.cell_x != undefined) ? options.cell_x : -1;
    this.cell_y = (options.cell_y != undefined) ? options.cell_y : -1;
    
    // Knot(s)
    this.knots=options.knots || 'ixox';
    this.angle = options.angle || 0; // Rotation angle of knot(s)
    this.nodes = options.nodes;

    
    // New ??
    this.svg = options.svg ||  {type: "circle",data: {"r": 50, "cx": 50, "cy": 50, "fill": "green"} };

    console.log('new Token '+this.ID+ ' '+this.cell_x+' '+this.cell_y+' '+this.props);
}

Token.CLOSABLE    = 1;
Token.CONTAINABLE = 2;
Token.LINKABLE    = 4;
Token.MOVABLE     = 8;
Token.RENDERABLE  = 16;
Token.ROTATABLE   = 32;

Token.prototype.getHTMLElement = function() {
    return document.getElementById(this.name);
};


Token.prototype.init = function() {

    var self = this;
    
    // Click to open popup
    function click(ev) {
        ev = ev || window.event;
        console.log('click '+self.ID);
        
        return false;
    }


    var el = document.getElementById(self.name);

    // Click to open popup
    el.addEventListener("click",click,false); 
    
    // Initiate the drag
    el.addEventListener("mousedown", 
        function (ev) {
            ev = ev || window.event;
            self.dragMode = false;
            if ( (self.props & Token.MOVABLE) === Token.MOVABLE) {
                self.dragMode = true;
            }
            self.xStart = parseInt(ev.clientX);
            self.yStart = parseInt(ev.clientY);
            console.log('down '+self.ID+' '+self.xStart+' ' + self.yStart +' '+ self.dragMode);
            
            var el = document.getElementById(self.name);
            el.style.zIndex = 99;
            el.removeEventListener('click',click);
            
            return false;
        },
        false); 
    
    el.addEventListener("mousemove", 
        function (ev) {
            ev = ev || window.event;
            if (self.dragMode === true) {
                self.xDelta = parseInt(ev.clientX) - self.xStart;
                self.yDelta = parseInt(ev.clientY) - self.yStart;
                self.xStart = parseInt(ev.clientX);
                self.yStart = parseInt(ev.clientY);
                console.log('mousemove '+self.ID+' '+ev.clientX+ ' ' + ev.clientY +' '+ev.target+' ' + self.xDelta+' ' + self.yDelta +' '+ self.dragMode);
                // Update css style
                var el = document.getElementById(self.name);
                console.log('Offsets '+el.offsetLeft+' '+ el.offsetTop);

                el.style.left = (el.offsetLeft + self.xDelta ) + 'px';
                el.style.top  = (el.offsetTop  + self.yDelta ) + 'px';
            }
            return false;
        },
        false);


    el.addEventListener("mouseup", 
        function (ev) {
            self.dragMode = false;
            console.log('mouseup '+self.ID+' '+self.xStart+' ' + self.yStart +' '+ self.dragMode);
            var el = document.getElementById(self.name);
            el.style.zIndex = 1;
            var viewportOffset = game.board.getHTMLElement().getBoundingClientRect();
            // these are relative to the viewport

            var cell_x = self.xStart - parseInt(viewportOffset.left);
            var cell_y = self.yStart - parseInt(viewportOffset.top);

            cell_x /= Game.TOKENSIZE;
            cell_y /= Game.TOKENSIZE;
            
            // Clamp
            cell_x = Math.min(Math.max(Math.floor(cell_x), 0.0), parseFloat(game.board.width - 1));
            cell_y = Math.min(Math.max(Math.floor(cell_y), 0.0), parseFloat(game.board.height - 1));
            
            console.log('board ' + cell_x +' '+cell_y+' '+game.board.cells[cell_x + game.board.width * cell_y] );

            if (game.board.cells[cell_x + game.board.width * cell_y] === 0) {    
                // Update board and **this** token
                if (self.status === -1) {
                    self.status = 0;
                    // Update sandbox
                }
                else
                    game.board.cells[self.cell_x + game.board.width * self.cell_y] = 0;

                self.cell_x = cell_x;
                self.cell_y = cell_y;
                game.board.cells[self.cell_x + game.board.width * self.cell_y] = self.ID;
                
                el.style.left = (self.cell_x * Game.TOKENSIZE) + 'px'; // viewportOffset.left + 
                el.style.top  = (self.cell_y * Game.TOKENSIZE) + 'px'; // viewportOffset.top  + 
            }
            else {
                el.style.left = (self.cell_x * Game.TOKENSIZE) + 'px';
                el.style.top  = (self.cell_y * Game.TOKENSIZE) + 'px';
            }
            

            el.addEventListener('click',click);
        },
        false);
        
        // Settings buttonSW
        var xy = {
            'oixx' : '0px',
            'oxix' : '-80px',
            'oxxi' : '-160px',
            'ooxi' : '-240px',
            'oxoi' : '-320px',
            'oxii' : '-400px',
            'oixi' : '-480px',
            'oooi' : '-540px',
            'oiii' : '-640px'
        }
        var settings = document.querySelector('#'+self.name +' .settings');
        if (settings !== null) {
            settings.addEventListener(
                'click',
                function (ev) {
                    document.getElementById('popup').style.display = 'inline-block';
                    document.querySelector('#popup #title').innerHTML = 'Settings';
                    var content = document.querySelector('#popup .contents');

                    var str = self.knots.reduce(
                        function (accu,k) {
                            accu += '<li><a style="float:left" "href="#">'+ k +
                                '<div class="crop"><img style="position:absolute;left:'+ xy[k] +
                                '" src="../images/knotSettings.png"></div></a></li>';
                            return accu;
                        },
                        '<ul>'
                    )
                    content.innerHTML = str;
                },
                false
            );
        }

}


Token.prototype.getKnotRect = function(type) {
    var rect='';
    switch (type) {
    case 'o':
        rect= 'rect(0px '+this.height+'px '+this.height+'px   0px)';
        break;
    case 'O':
        rect= 'rect(0px '+(2*this.height)+'px '+this.height+'px '+   this.height +'px)';
        break;
    case 'i':
        rect= 'rect(0px '+(3*this.height)+'px '+this.height+'px '+(2*this.height)+'px)';
        break;
    case 'I':
        rect= 'rect(0px '+(4*this.height)+'px '+this.height+'px '+(3*this.height)+'px)';
        break;
    default:
        rect= 'rect(0px '+this.height+'px '+this.height+'px   0px)';
    }
    return rect;
}

Token.prototype.getKnotLeft = function(type) {
    var left = 0;
    switch (type) {
    case 'o':
        left=0;
        break;
    case 'O':
        left=-this.height;
        break;
    case 'i':
        left=-2*this.height;
        break;
    case 'I':
        left=-3*this.height;
        break;
    default:
        left=0;
    }
    return left;
}

/*
 *  OBIFlow: Omics and Bioinformatics visual programming workflow
 *  Copyright (C) 2016  Jean-Christophe Taveau.
 *
 *  This file is part of OBIFlow
 *
 * This program is free software: you can redistribute it and/or modify it
 * under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with mowgli.  If not, see <http://www.gnu.org/licenses/>.
 *
 *
 * Authors:
 * Jean-Christophe Taveau
 */

var TokenFactory = (function() {
    var arrowHead = 'm 574.38196,991.65854 0,-73.98298 71.64807,-0.55974 -146.02893,-105.54043 -146.02894,105.54043 71.64741,0.55974 0,73.98298 74.38153,-1.23443 z';
    var arrowTail = '';
    
    // Private - Create all the buttons
    
    
    // Private - Create all the knots
    function createKnots(k) {
        var svg_node = document.createElementNS('http://www.w3.org/2000/svg','g');
            svg_node.setAttributeNS(null,'id','knots');
            svg_node.setAttributeNS(null,'transform','rotate(0,500,500)');

            for (var i=0; i < k.length; i++) {
                if (k[i] === 'i') {
                    var tmp = document.createElementNS('http://www.w3.org/2000/svg','path');
                    var angle = (180 + 90*i) % 360;
                    tmp.setAttributeNS(null,'transform','rotate('+angle+',500,500)');
                    tmp.setAttributeNS(null,'d',arrowHead);
                    tmp.setAttributeNS(null,'fill','#ffffff');
                    tmp.setAttributeNS(null,'stroke','#000000');
                    tmp.setAttributeNS(null,'stroke-width',18.0);
                    tmp.setAttributeNS(null,'stroke-linejoin','round');
                    svg_node.appendChild(tmp);
                }
                else if (k[i] === 'o') {
                    var tmp = document.createElementNS('http://www.w3.org/2000/svg','rect');
                    var angle = 90*i; 
                    tmp.setAttributeNS(null,'transform','rotate('+angle+',500,500)');
                    tmp.setAttributeNS(null,'x',500.0 - 150/2.0);
                    tmp.setAttributeNS(null,'y',9.0);
                    tmp.setAttributeNS(null,'width',150);
                    tmp.setAttributeNS(null,'height',128);
                    tmp.setAttributeNS(null,'fill','#FFFFFF');
                    tmp.setAttributeNS(null,'stroke','#000000');
                    tmp.setAttributeNS(null,'stroke-width',18.0);
                    svg_node.appendChild(tmp);
                }
            }
        return svg_node;
    }
    return {
        get: function (options) {
        
            // Create token depending of its type
            var _options = tokenIDs[options.type];
            for (var prop in options) {
                _options[prop] = options[prop];
            }
            var tok = new Token(_options);
            console.log(JSON.stringify(tok));
            tok.currentKnots = tok.knots[0];
            
            // Create GUI 
            
            var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.setAttributeNS(null,'width', Game.TOKENSIZE);
            svg.setAttributeNS(null,'height', Game.TOKENSIZE);
            svg.setAttributeNS(null,'viewBox', '0 0 1000 1000');
            svg.setAttributeNS(null,'transform', 'matrix(1 0 0 1 0 0)');

            
            // Background
            var bckgd = document.createElementNS('http://www.w3.org/2000/svg','rect');
            bckgd.setAttributeNS(null,'x',9.0);
            bckgd.setAttributeNS(null,'y',9.0);
            bckgd.setAttributeNS(null,'width',982);
            bckgd.setAttributeNS(null,'height',982);
            bckgd.setAttributeNS(null,'rx',144.0);
            bckgd.setAttributeNS(null,'ry',144.0);
            bckgd.setAttributeNS(null,'fill','#FFFFFF');
            bckgd.setAttributeNS(null,'stroke','#000000');
            bckgd.setAttributeNS(null,'stroke-width',18.0);

            svg.appendChild(bckgd);
            
            // Button(s)
            var buttonNW = document.createElementNS('http://www.w3.org/2000/svg','circle');
            buttonNW.setAttributeNS(null,'cx',150);
            buttonNW.setAttributeNS(null,'cy',150);
            buttonNW.setAttributeNS(null,'r',105);
            buttonNW.setAttributeNS(null,'fill','#FF8000');
            buttonNW.setAttributeNS(null,'style','stroke:#000000;stroke-width:18.0;');
            svg.appendChild(buttonNW);
            
            var buttonNE = document.createElementNS('http://www.w3.org/2000/svg','circle');
            buttonNE.setAttributeNS(null,'cx',850);
            buttonNE.setAttributeNS(null,'cy',150);
            buttonNE.setAttributeNS(null,'r',105);
            buttonNE.setAttributeNS(null,'fill','#FF8000');
            buttonNE.setAttributeNS(null,'style','stroke:#000000;stroke-width:18.0;');

            buttonNE.addEventListener('click',
                function(ev) {
                    console.log(ev.target);
                    var knots_layer = ev.target.parentNode.querySelector("#knots");
                    var arr = knots_layer.getAttributeNS(null, "transform").slice(7,-1).split(',');
                    // Permutation
                    tok.currentKnots = tok.currentKnots[3] + tok.currentKnots.substr(0,3);
                    
                    arr[0] = (parseInt(arr[0])+90)%360;
                    knots_layer.setAttributeNS(null,'transform','rotate('+arr.join(',')+')');
                });
            svg.appendChild(buttonNE);
            
            if (tok.knots.length > 1) {
                var buttonSW = document.createElementNS('http://www.w3.org/2000/svg','circle');
                buttonSW.setAttributeNS(null,'class','settings');
                buttonSW.setAttributeNS(null,'cx',150);
                buttonSW.setAttributeNS(null,'cy',850);
                buttonSW.setAttributeNS(null,'r',105);
                buttonSW.setAttributeNS(null,'fill','#FF8000');
                buttonSW.setAttributeNS(null,'style','stroke:#000000;stroke-width:18.0;');
                svg.appendChild(buttonSW);
            }

/*
            var buttonSE = document.createElementNS('http://www.w3.org/2000/svg','circle');
            buttonSE.setAttributeNS(null,'cx',850);
            buttonSE.setAttributeNS(null,'cy',850);
            buttonSE.setAttributeNS(null,'r',105);
            buttonSE.setAttributeNS(null,'fill','#FF8000');
            buttonSE.setAttributeNS(null,'style','stroke:#000000;stroke-width:18.0;');
            svg.appendChild(buttonSE);
*/
            
            // Knot(s)
            svg.appendChild(createKnots(tok.currentKnots) );
           
           // Icon
            var primitive = document.createElementNS("http://www.w3.org/2000/svg",tok.svg.type);
            for (var prop in tok.svg.data) {
                primitive.setAttributeNS(null,prop,tok.svg.data[prop]);
            }

            if (tok.svg.type === 'g') {
                for (var sub=0; sub < tok.svg.children.length; sub++) {
                    var subprimitive = document.createElementNS("http://www.w3.org/2000/svg",tok.svg.children[sub].type);
                    for (var prop in tok.svg.children[sub].data) {
                        subprimitive.setAttributeNS(null,prop,tok.svg.children[sub].data[prop]);
                    }
                    primitive.appendChild(subprimitive);
                }
            }

            svg.appendChild(primitive);
            
            // Embed svg in a div for sake of convenience
            var finalTok = document.createElement('div');
            finalTok.setAttribute('title',tok.title);

            var klass = 'token';
            if ( (tok.props & Token.MOVABLE) === Token.MOVABLE) {
                klass += ' draggable';
            }
            finalTok.setAttribute('class', klass);
            finalTok.setAttribute('id', tok.name);
            finalTok.appendChild(svg);
            tok.html=finalTok;
            return tok;
        }
    }

})();

/*
 *  OBIFlow: Omics and Bioinformatics visual programming workflow
 *  Copyright (C) 2016  Jean-Christophe Taveau.
 *
 *  This file is part of OBIFlow
 *
 * This program is free software: you can redistribute it and/or modify it
 * under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with mowgli.  If not, see <http://www.gnu.org/licenses/>.
 *
 *
 * Authors:
 * Jean-Christophe Taveau
 */

function TokenSandBox(options) {
    // Init
    this.ID = options.ID || 'UNK__TOK';
    this.type = options.type || 'unknown';
    this.name = options.name || 'unknown';
    this.current = options.current || 0;
    this.description = options.description  || {title:'None',contents:''};
    this.title = options.title || 'No title';

    // Geometry and Board location
    this.orgx = options.orgx || 0;
    this.orgy = options.orgy || 0;
    this.width = options.width || Game.TOKENSIZE;
    this.height = options.height || Game.TOKENSIZE;
    this.cell_x = (options.cell_x != undefined) ? options.cell_x : -1;
    this.cell_y = (options.cell_y != undefined) ? options.cell_y : -1;
    

    // New ??
    this.svg = options.svg ||  {type: "circle",data: {"r": 50, "cx": 50, "cy": 50, "fill": "green"} };

    console.log('new Token '+this.ID+ ' '+this.cell_x+' '+this.cell_y+' '+this.props);
}


TokenSandBox.prototype.getHTMLElement = function() {
    return document.getElementById(this.name);
};


TokenSandBox.prototype.init = function() {

    var self = this;
    var el = document.getElementById(self.name);

    // Click to open popup
    function click(ev) {
        ev = ev || window.event;
        console.log('click '+self.ID+' '+self.type);
        
        game.board.addToken({type: self.type,name: self.type+'_'+self.current});
        
        return false;
    }




    el.addEventListener("mouseup", 
        function (ev) {
            self.dragMode = false;
            console.log('mouseup '+self.ID+' '+self.xStart+' ' + self.yStart +' '+ self.dragMode);
            var el = document.getElementById(self.name);
            el.style.zIndex = 1;
            var viewportOffset = game.board.getHTMLElement().getBoundingClientRect();
            // these are relative to the viewport

            var cell_x = self.xStart - parseInt(viewportOffset.left);
            var cell_y = self.yStart - parseInt(viewportOffset.top);

            cell_x /= Game.TOKENSIZE;
            cell_y /= Game.TOKENSIZE;
            
            // Clamp
            cell_x = Math.min(Math.max(Math.floor(cell_x), 0.0), parseFloat(game.board.width - 1));
            cell_y = Math.min(Math.max(Math.floor(cell_y), 0.0), parseFloat(game.board.height - 1));
            
            console.log('board ' + cell_x +' '+cell_y+' '+game.board.cells[cell_x + game.board.width * cell_y] );

            if (game.board.cells[cell_x + game.board.width * cell_y] === 0) {    
                // Update board and **this** token
                if (self.status === -1) {
                    self.status = 0;
                    // Update sandbox
                    game.sandbox.refill(self);
                }
                else
                    game.board.cells[self.cell_x + game.board.width * self.cell_y] = 0;

                self.cell_x = cell_x;
                self.cell_y = cell_y;
                game.board.cells[self.cell_x + game.board.width * self.cell_y] = self.ID;
                
                el.style.left = (viewportOffset.left + self.cell_x * Game.TOKENSIZE - 6) + 'px';
                el.style.top  = (viewportOffset.top  + self.cell_y * Game.TOKENSIZE - 6) + 'px';
            }
            else {
                el.style.left = (viewportOffset.left + self.cell_x * Game.TOKENSIZE - 6) + 'px';
                el.style.top  = (viewportOffset.top  + self.cell_y * Game.TOKENSIZE - 6) + 'px';
            }
            

            el.addEventListener('click',click);
        },
        false);
        
}




/*
 *  OBIFlow: Omics and Bioinformatics visual programming workflow
 *  Copyright (C) 2016  Jean-Christophe Taveau.
 *
 *  This file is part of OBIFlow
 *
 * This program is free software: you can redistribute it and/or modify it
 * under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with mowgli.  If not, see <http://www.gnu.org/licenses/>.
 *
 *
 * Authors:
 * Jean-Christophe Taveau
 */

var TokenSandBoxFactory = (function() {
    
    // Private - Create all the buttons
    
    
    return {
        get: function (options) {
        
            // Create token depending of its type
            var _options = tokenIDs[options.type];
            for (var prop in options) {
                _options[prop] = options[prop];
            }
            var tok = new TokenSandBox(_options);
            tok.name +='_sandbox';
            
            // Create GUI  
            var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.setAttributeNS(null,'width', Game.TOKENSIZE);
            svg.setAttributeNS(null,'height', Game.TOKENSIZE);
            svg.setAttributeNS(null,'viewBox', '0 0 1000 1000');
            svg.setAttributeNS(null,'transform', 'matrix(1 0 0 1 0 0)');

            // Background
            var bckgd = document.createElementNS('http://www.w3.org/2000/svg','rect');
            bckgd.setAttributeNS(null,'x',9.0);
            bckgd.setAttributeNS(null,'y',9.0);
            bckgd.setAttributeNS(null,'width',982);
            bckgd.setAttributeNS(null,'height',982);
            bckgd.setAttributeNS(null,'rx',144.0);
            bckgd.setAttributeNS(null,'ry',144.0);
            bckgd.setAttributeNS(null,'fill','#FFFFFF');
            bckgd.setAttributeNS(null,'stroke','#000000');
            bckgd.setAttributeNS(null,'stroke-width',18.0);
            
            // Tooltip - Must be in first position
            var title = document.createElementNS("http://www.w3.org/2000/svg","title")
            title.textContent = tok.title;
            bckgd.appendChild(title);
            
            svg.appendChild(bckgd);
            
            // Button(s)
            /*
            var buttonNW = document.createElementNS('http://www.w3.org/2000/svg','circle');
            buttonNW.setAttributeNS(null,'cx',150);
            buttonNW.setAttributeNS(null,'cy',150);
            buttonNW.setAttributeNS(null,'r',105);
            buttonNW.setAttributeNS(null,'fill','#FF8000');
            buttonNW.setAttributeNS(null,'style','stroke:#000000;stroke-width:18.0;');
            svg.appendChild(buttonNW);
            
            var buttonNE = document.createElementNS('http://www.w3.org/2000/svg','circle');
            buttonNE.setAttributeNS(null,'cx',850);
            buttonNE.setAttributeNS(null,'cy',150);
            buttonNE.setAttributeNS(null,'r',105);
            buttonNE.setAttributeNS(null,'fill','#FF8000');
            buttonNE.setAttributeNS(null,'style','stroke:#000000;stroke-width:18.0;');
            svg.appendChild(buttonNE);
            */
           
           // Icon
            var primitive = document.createElementNS("http://www.w3.org/2000/svg",tok.svg.type);
            for (var prop in tok.svg.data) {
                primitive.setAttributeNS(null,prop,tok.svg.data[prop]);
            }

            if (tok.svg.type === 'g') {
                for (var sub=0; sub < tok.svg.children.length; sub++) {
                    var subprimitive = document.createElementNS("http://www.w3.org/2000/svg",tok.svg.children[sub].type);
                    for (var prop in tok.svg.children[sub].data) {
                        subprimitive.setAttributeNS(null,prop,tok.svg.children[sub].data[prop]);
                    }
                    primitive.appendChild(subprimitive);
                }
            }

            svg.appendChild(primitive);
            
            // Embed svg in a div for sake of convenience


            svg.setAttributeNS(null,'id', tok.name);
            svg.setAttributeNS(null,'class', 'token_sandbox');
            tok.html= svg; //finalTok;
            return tok;
        }
    }

})();

var tokenIDs = {
    'biotools'     :  {
        "ID"     : "BIOT_TOK",
        "name"   : "biotools",
        "comment": "BioTools: Collection of Utilities for Bioinformatics",
        "props"  : Token.CLOSABLE | Token.CONTAINABLE | Token.LINKABLE | Token.MOVABLE | Token.RENDERABLE | Token.ROTATABLE,
        "knots"  : ["oxxx"],
        "title"  : "BIO::Tools",
        "input"  : "none",
        "output" : "any",
        "args"   : "none",
        "description": {
            "title"  :"",
            "content":""
        },
        "svg"    : {
            "type": "path",
            "data": {
                "d": "m 773.18252,731.9209 q 21.91186,34.8242 8.41259,59.67068 -13.49927,24.84648 -54.97528,24.84648 H 275.86168 q -41.47601,0 "+
                "-54.97527,-24.84648 -13.49927,-24.84648 8.41258,-59.67068 L 426.1144,421.63338 V 265.51142 h -25.04212 q -10.17336,0 -17.60774,-7.43438 "+
                "-7.43438,-7.43438 -7.43438,-17.60774 0,-10.17336 7.43438,-17.60774 7.43438,-7.43438 17.60774,-7.43438 h 200.33695 q 10.17337,0 "+
                "17.60775,7.43438 7.43437,7.43438 7.43437,17.60774 0,10.17336 -7.43437,17.60774 -7.43438,7.43438 -17.60775,7.43438 H 576.36712 "+
                "V 421.63338 z M 468.37298,448.24064 361.94397,616.1011 H 640.53755 L 534.10854,448.24064 526.28288,436.11086 V 265.51142 h -50.08424 v 170.59944 z"
            }
        },
    },
    'calcArray'   : {
        "ID"    : "ARRA_TOK",
        "name"   :"calcArray",
        "comment": "Container of Array Functions",
        "props"  : Token.CLOSABLE | Token.CONTAINABLE | Token.LINKABLE | Token.MOVABLE | Token.SWITCHABLE | Token.RENDERABLE | Token.ROTATABLE,
        "knots"  : ["oxix","oixx","oxxi"],
        "title"  : "Array Calculator",
        "input"  : "number",
        "output" : "number",
        "args"   : ["expression"],
        "icon"   :"calcNumber",
        "description": {
            "title":"",
            "content":""
        },
        "svg"    : {
            "type": "path",
            "data": {
                "d": "m 433.87584,478.67817 q 0,-8.89101 -6.29081,-15.18181 -6.2908,-6.29081 -15.18181,-6.29081 -8.89101,0 -15.18181,6.29081 -6.29081,6.2908 -6.29081,15.18181 0,8.89101 6.29081,15.18181 6.2908,6.29081 15.18181,6.29081 8.89101,0 15.18181,-6.29081 6.29081,-6.2908 6.29081,-15.18181 z m 64.41784,0 q 0,-8.89101 -6.29081,-15.18181 -6.2908,-6.29081 -15.18181,-6.29081 -8.891,0 -15.1818,6.29081 -6.29081,6.2908 -6.29081,15.18181 0,8.89101 6.29081,15.18181 6.2908,6.29081 15.1818,6.29081 8.89101,0 15.18181,-6.29081 6.29081,-6.2908 6.29081,-15.18181 z m -64.41784,-64.41784 q 0,-8.89101 -6.29081,-15.18181 -6.2908,-6.29081 -15.18181,-6.29081 -8.89101,0 -15.18181,6.29081 -6.29081,6.2908 -6.29081,15.18181 0,8.891 6.29081,15.1818 6.2908,6.29081 15.18181,6.29081 8.89101,0 15.18181,-6.29081 6.29081,-6.2908 6.29081,-15.1818 z m 128.83569,64.41784 q 0,-8.89101 -6.29081,-15.18181 -6.29081,-6.29081 -15.18181,-6.29081 -8.891,0 -15.18181,6.29081 -6.2908,6.2908 -6.2908,15.18181 0,8.89101 6.2908,15.18181 6.29081,6.29081 15.18181,6.29081 8.891,0 15.18181,-6.29081 6.29081,-6.2908 6.29081,-15.18181 z m -64.41785,-64.41784 q 0,-8.89101 -6.29081,-15.18181 -6.2908,-6.29081 -15.18181,-6.29081 -8.891,0 -15.1818,6.29081 -6.29081,6.2908 -6.29081,15.18181 0,8.891 6.29081,15.1818 6.2908,6.29081 15.1818,6.29081 8.89101,0 15.18181,-6.29081 6.29081,-6.2908 6.29081,-15.1818 z m -64.41784,-64.41785 q 0,-8.891 -6.29081,-15.18181 -6.2908,-6.29081 -15.18181,-6.29081 -8.89101,0 -15.18181,6.29081 -6.29081,6.29081 -6.29081,15.18181 0,8.891 6.29081,15.18181 6.2908,6.2908 15.18181,6.2908 8.89101,0 15.18181,-6.2908 6.29081,-6.29081 6.29081,-15.18181 z m 128.83569,64.41785 q 0,-8.89101 -6.29081,-15.18181 -6.29081,-6.29081 -15.18181,-6.29081 -8.891,0 -15.18181,6.29081 -6.2908,6.2908 -6.2908,15.18181 0,8.891 6.2908,15.1818 6.29081,6.29081 15.18181,6.29081 8.891,0 15.18181,-6.29081 6.29081,-6.2908 6.29081,-15.1818 z m -64.41785,-64.41785 q 0,-8.891 -6.29081,-15.18181 -6.2908,-6.29081 -15.18181,-6.29081 -8.891,0 -15.1818,6.29081 -6.29081,6.29081 -6.29081,15.18181 0,8.891 6.29081,15.18181 6.2908,6.2908 15.1818,6.2908 8.89101,0 15.18181,-6.2908 6.29081,-6.29081 6.29081,-15.18181 z m 128.83569,128.83569 v -64.41784 q 0,-8.72326 -6.37468,-15.09793 -6.37468,-6.37469 -15.09794,-6.37469 -8.72325,0 -15.09793,6.37469 -6.37468,6.37467 -6.37468,15.09793 v 64.41784 q 0,8.72325 6.37468,15.09793 6.37468,6.37469 15.09793,6.37469 8.72326,0 15.09794,-6.37469 6.37468,-6.37468 6.37468,-15.09793 z M 562.71153,349.84248 q 0,-8.891 -6.29081,-15.18181 -6.29081,-6.29081 -15.18181,-6.29081 -8.891,0 -15.18181,6.29081 -6.2908,6.29081 -6.2908,15.18181 0,8.891 6.2908,15.18181 6.29081,6.2908 15.18181,6.2908 8.891,0 15.18181,-6.2908 6.29081,-6.29081 6.29081,-15.18181 z m 64.41784,-53.68154 v -42.94523 q 0,-4.36162 -3.18734,-7.54896 -3.18734,-3.18735 -7.54897,-3.18735 H 401.66691 q -4.36162,0 -7.54896,3.18735 -3.18735,3.18734 -3.18735,7.54896 v 42.94523 q 0,4.36163 3.18735,7.54897 3.18734,3.18734 7.54896,3.18734 h 214.72615 q 4.36163,0 7.54897,-3.18734 3.18734,-3.18734 3.18734,-7.54897 z m 0,53.68154 q 0,-8.891 -6.2908,-15.18181 -6.29081,-6.29081 -15.18182,-6.29081 -8.891,0 -15.18181,6.29081 -6.2908,6.29081 -6.2908,15.18181 0,8.891 6.2908,15.18181 6.29081,6.2908 15.18181,6.2908 8.89101,0 15.18182,-6.2908 6.2908,-6.29081 6.2908,-15.18181 z M 648.60199,242.4794 v 257.67139 q 0,8.72324 -6.37469,15.09793 -6.37468,6.37468 -15.09793,6.37468 H 390.9306 q -8.72324,0 -15.09793,-6.37468 -6.37468,-6.37469 -6.37468,-15.09793 V 242.4794 q 0,-8.72324 6.37468,-15.09793 6.37469,-6.37468 15.09793,-6.37468 h 236.19877 q 8.72325,0 15.09793,6.37468 6.37469,6.37469 6.37469,15.09793 z m 53.43857,562.04073 0,-35.83906 51.26975,0 0,-396.71838 -51.26975,0 0,-35.83905 92.58421,0 0,468.39649 -92.58421,0 m -43.80329,-157.29362 0,51.76752 -51.76752,0 0,-51.76752 51.76752,0 m -124.44115,0 0,51.76752 -51.76751,0 0,-51.76752 51.76751,0 m -124.44115,0 0,51.76752 -51.76751,0 0,-51.76752 51.76751,0 m -105.19943,-311.10287 0,35.83905 -51.26976,0 0,396.71838 51.26976,0 0,35.83906 -92.58422,0 0,-468.39649 92.58422,0"
            }
        }
    },
    'calcNumber'   : {
        "ID"    : "CALC_TOK",
        "name"   :"calcNumber",
        "comment": "Container of arithmetic Functions",
        "props"  : Token.CLOSABLE | Token.CONTAINABLE | Token.LINKABLE | Token.MOVABLE | Token.SWITCHABLE | Token.RENDERABLE | Token.ROTATABLE,
        "knots"  : ["oxix","oixx","oxxi"],
        "title"  : "Calculator",
        "input"  : "number",
        "output" : "number",
        "args"   : ["expression"],
        "icon"   :"calcNumber",
        "description": {
            "title":"",
            "content":""
        },
        "svg"    : {
            "type": "path",
            "data": {
                "transform" : "translate(0,-52.362183)",
                "d": "m 357.1895,756.18705 q 0,-16.97447 -11.9548,-28.9837 -11.95347,-12.00989 -28.84979,-12.00989 -16.89434,0 -28.8498,12.00989 "+
        "-11.95281,12.00923 -11.95281,28.9837 0,16.9738 11.95281,28.98369 11.95546,12.0099 28.8498,12.0099 16.89632,0 28.84979,-12.0099 "+
        "11.9548,-12.00989 11.9548,-28.98369 z m 122.40915,0 q 0,-16.97447 -11.95347,-28.9837 -11.95414,-12.00989 -28.8498,-12.00989 "+
        "-16.89433,0 -28.84913,12.00989 -11.95414,12.00923 -11.95414,28.9837 0,16.9738 11.95414,28.98369 11.9548,12.0099 28.84913,12.0099 "+
        "16.89566,0 28.8498,-12.0099 11.95347,-12.00989 11.95347,-28.98369 z M 357.1895,633.20561 q 0,-16.9738 -11.9548,-28.9837 -11.95347,-12.00989 "+
        "-28.84979,-12.00989 -16.89434,0 -28.8498,12.00989 -11.95281,12.0099 -11.95281,28.9837 0,16.97446 11.95281,28.9837 11.95546,12.00989 "+
        "28.8498,12.00989 16.89632,0 28.84979,-12.00989 11.9548,-12.00924 11.9548,-28.9837 z m 244.81897,122.98144 q 0,-16.97447 -11.95348,-28.9837 "+
        "-11.9548,-12.00989 -28.84913,-12.00989 -16.895,0 -28.8498,12.00989 -11.95347,12.00923 -11.95347,28.9837 0,16.9738 11.95347,28.98369 "+
        "11.9548,12.0099 28.8498,12.0099 16.89433,0 28.84913,-12.0099 11.95348,-12.00989 11.95348,-28.98369 z M 479.59865,633.20561 q 0,-16.9738 "+
        "-11.95347,-28.9837 -11.95414,-12.00989 -28.8498,-12.00989 -16.89433,0 -28.84913,12.00989 -11.95414,12.0099 -11.95414,28.9837 0,16.97446 "+
        "11.95414,28.9837 11.9548,12.00989 28.84913,12.00989 16.89566,0 28.8498,-12.00989 11.95347,-12.00924 11.95347,-28.9837 z M 357.1895,510.22484 "+
        "q 0,-16.97447 -11.9548,-28.98437 -11.95347,-12.00923 -28.84979,-12.00923 -16.89434,0 -28.8498,12.00923 -11.95281,12.0099 -11.95281,28.98437 "+
        "0,16.9738 11.95281,28.98369 11.95546,12.0099 28.8498,12.0099 16.89632,0 28.84979,-12.0099 11.9548,-12.00989 11.9548,-28.98369 z m 244.81897,122.98077 "+
        "q 0,-16.9738 -11.95348,-28.9837 -11.9548,-12.00989 -28.84913,-12.00989 -16.895,0 -28.8498,12.00989 -11.95347,12.0099 -11.95347,28.9837 "+
        "0,16.97446 11.95347,28.9837 11.9548,12.00989 28.8498,12.00989 16.89433,0 28.84913,-12.00989 11.95348,-12.00924 11.95348,-28.9837 z M 479.59865,510.22484 "+
        "q 0,-16.97447 -11.95347,-28.98437 -11.95414,-12.00923 -28.8498,-12.00923 -16.89433,0 -28.84913,12.00923 -11.95414,12.0099 -11.95414,28.98437 "+
        "0,16.9738 11.95414,28.98369 11.9548,12.0099 28.84913,12.0099 16.89566,0 28.8498,-12.0099 11.95347,-12.00989 11.95347,-28.98369 z m 244.8203,245.96221 "+
        "V 633.20561 q 0,-16.65338 -12.11295,-28.82348 -12.1136,-12.17011 -28.68966,-12.17011 -16.57673,0 -28.69033,12.17011 -12.11427,12.1701 "+
        "-12.11427,28.82348 v 122.98144 q 0,16.65338 12.11427,28.82348 12.1136,12.17011 28.69033,12.17011 16.57606,0 28.68966,-12.17011 12.11295,-12.1701 "+
        "12.11295,-28.82348 z M 602.00847,510.22484 q 0,-16.97447 -11.95348,-28.98437 -11.9548,-12.00923 -28.84913,-12.00923 -16.895,0 -28.8498,12.00923 "+
        "-11.95347,12.0099 -11.95347,28.98437 0,16.9738 11.95347,28.98369 11.9548,12.0099 28.8498,12.0099 16.89433,0 28.84913,-12.0099 11.95348,-12.00989 "+
        "11.95348,-28.98369 z M 724.41895,407.74052 v -81.98784 q 0,-8.32636 -6.05648,-14.41175 -6.05647,-6.08472 -14.34549,-6.08472 H 295.98426 q -8.28902,0"+
        " -14.34549,6.08472 -6.05647,6.08539 -6.05647,14.41175 v 81.98784 q 0,8.32636 6.05647,14.41175 6.05647,6.08472 14.34549,6.08472 h 408.03272 q 8.28902,0 "+
        "14.34549,-6.08472 6.05648,-6.08539 6.05648,-14.41175 z m 0,102.48432 q 0,-16.97447 -11.95348,-28.98437 -11.9548,-12.00923 -28.84913,-12.00923 "+
        "-16.89632,0 -28.8498,12.00923 -11.9548,12.0099 -11.9548,28.98437 0,16.9738 11.9548,28.98369 11.95348,12.0099 28.8498,12.0099 16.89433,0 "+
        "28.84913,-12.0099 11.95348,-12.00989 11.95348,-28.98369 z m 40.80327,-204.96863 v 491.92443 q 0,16.65338 -12.11361,28.82348 -12.11294,12.17011 "+
        "-28.68966,12.17011 H 275.5823 q -16.57673,0 -28.69033,-12.17011 -12.11295,-12.1701 -12.11295,-28.82348 V 305.25621 q 0,-16.65404 12.11295,-28.82415"+
        " 12.1136,-12.16944 28.69033,-12.16944 h 448.83665 q 16.57672,0 28.68966,12.16944 12.11361,12.17011 12.11361,28.82415 z"
            }
        }
     },
    'calcString'   : {
        "ID"     : "STRG_TOK",
        "name"   : "calcString",
        "comment": "Container of String Functions",
        "props"  : Token.CLOSABLE | Token.CONTAINABLE | Token.LINKABLE | Token.MOVABLE | Token.SWITCHABLE | Token.RENDERABLE | Token.ROTATABLE,
        "knots"  : ["oxix","oixx","oxxi"],
        "title"  : "String Calculator",
        "input"  : "string",
        "output" : "any",
        "args"   : ["expression"],
        "icon"   :"calcString",
        "description": {
            "title":"",
            "content":""
        },
        "svg"    : {
            "type": "path",
            "data": {
                "d": "m 245.36766,214.47247 21.13727,10.56867 c 3.13144,1.30477 30.66223,1.95719 82.5922,1.95719 11.48207,0 28.70504,-0.26065 "+
                "51.66898,-0.78288 22.96407,-0.52196 40.18705,-0.78287 51.66905,-0.78287 9.39436,0 23.42074,0.0665 42.079,0.19548 18.6582,0.13033 "+
                "32.68458,0.19549 42.07894,0.19549 l 114.68951,0 c 1.56582,0 4.30581,0.0665 8.22012,0.19548 3.91431,0.13033 6.58914,0.13033 8.02436,0 "+
                "1.4353,-0.13032 3.52287,-0.52196 6.26293,-1.17424 2.74,-0.65229 5.02339,-1.82666 6.85005,-3.52287 1.82667,-1.69627 3.78385,-3.9796 "+
                "5.87143,-6.85012 l 16.44023,-0.39097 c 1.04379,0 2.87045,0.0665 5.47999,0.19549 2.60954,0.13032 4.43627,0.19548 5.48005,0.19548 0.52196,29.227 "+
                "0.78288,73.06731 0.78288,131.52118 0,20.87637 -0.65229,35.09843 -1.95712,42.66606 -10.17724,3.65339 -19.04977,6.00202 -26.6174,7.04581 "+
                "-6.52384,-11.48201 -13.56965,-28.18309 -21.13735,-50.1033 -0.78287,-2.34856 -2.21816,-8.61149 -4.30574,-18.78873 -2.08764,-10.17723 "+
                "-3.9796,-19.76734 -5.67574,-28.77027 -1.6962,-9.00292 -2.67483,-13.63487 -2.93574,-13.89579 -1.56575,-2.08764 -3.13144,-3.71862 "+
                "-4.69725,-4.89293 -1.56568,-1.17424 -3.58803,-1.95718 -6.06718,-2.34862 -2.47908,-0.39097 -4.17528,-0.71765 -5.08862,-0.97856 "+
                "-0.91333,-0.26065 -3.26195,-0.32648 -7.04573,-0.19549 -3.78385,0.13033 -5.93672,0.19549 -6.45862,0.19549 -4.43626,0 -13.11298,-0.0665 "+
                "-26.03027,-0.19549 -12.91723,-0.13032 -22.63787,-0.19548 -29.16171,-0.19548 -6.52385,0 -14.87435,0.26131 -25.05159,0.78287 -10.17723,0.52196 "+
                "-19.44114,1.30477 -27.79171,2.34856 -2.34862,21.13734 -3.39234,38.88228 -3.13143,53.2348 0,24.52969 0.26065,75.15495 0.78281,151.87558 "+
                "0.52196,76.7207 0.78287,136.08791 0.78287,178.10162 0,4.17528 -0.32647,13.50441 -0.97856,27.98739 -0.65228,14.48298 -0.65228,26.42165 "+
                "0,35.81608 0.65229,9.39436 2.28333,18.39721 4.89294,27.00877 10.43814,5.48005 26.61733,11.02534 48.53755,16.63585 21.92022,5.61051 "+
                "37.57744,10.50344 46.9718,14.67873 1.30477,10.43821 1.95719,16.96206 1.95719,19.57159 0,3.65339 -0.39098,7.43718 -1.17425,11.35148 "+
                "l -13.30873,0.39097 c -19.83258,0.52197 -48.27657,-0.52196 -85.33219,-3.13143 -37.05555,-2.6096 -64.06432,-3.91437 -81.02637,-3.91437 "+
                "-13.04776,0 -32.74988,1.17431 -59.1063,3.52287 -26.35641,2.34862 -46.18899,3.52293 -59.49766,3.52293 -0.78287,-13.30873 -1.17431,-20.09355 "+
                "-1.17431,-20.35447 l 0,-3.52286 c 4.4362,-7.04581 12.46057,-12.65632 24.07309,-16.83161 11.61246,-4.17528 24.46446,-7.95906 "+
                "38.55607,-11.35154 14.09154,-3.39241 24.26871,-6.91528 30.53164,-10.56867 4.95816,-10.96005 7.43724,-60.93289 7.43724,-149.91847 0,-26.35642 "+
                "-0.39097,-65.89105 -1.17431,-118.60389 -0.78288,-52.71283 -1.17425,-92.24746 -1.17425,-118.60395 l 0,-45.79749 c 0,-0.52196 0.0665,-2.54431 "+
                "0.19549,-6.06718 0.13032,-3.52293 0.19549,-6.78489 0.19549,-9.78586 0,-3.00098 -0.13033,-6.32809 -0.39098,-9.98148 -0.26064,-3.6534 "+
                "-0.65228,-6.78483 -1.17431,-9.39436 -0.52196,-2.60954 -1.17431,-4.43627 -1.95718,-5.48006 -2.87046,-3.1315 -24.0078,-4.69718 -63.41197,-4.69718 "+
                "-8.61155,0 -20.74591,1.56568 -36.4032,4.69718 -15.65729,3.13143 -26.0955,6.52391 -31.31458,10.17724 -4.95816,3.39241 -9.39436,12.85206 "+
                "-13.30866,28.37883 -3.91431,15.52677 -8.02437,30.00981 -12.33011,43.44893 -4.30574,13.43913 -9.85103,20.4197 -16.63585,20.9416 "+
                "-10.96011,-6.78483 -18.26683,-12.5258 -21.92022,-17.22298 l 0,-149.91846 z m 354.98782,485.99509 q 0,-7.7346 -5.47294,-13.20714 "+
                "-5.47228,-5.4726 -13.20727,-5.4726 -7.73432,0 -13.20726,5.4726 -5.47228,5.47254 -5.47228,13.20714 0,7.73459 5.47228,13.20713 5.47294,5.47261 "+
                "13.20726,5.47261 7.73499,0 13.20727,-5.47261 5.47294,-5.47254 5.47294,-13.20713 z m 56.03863,0 q 0,-7.7346 -5.47228,-13.20714 "+
                "-5.47228,-5.4726 -13.20727,-5.4726 -7.73432,0 -13.20726,5.4726 -5.47228,5.47254 -5.47228,13.20714 0,7.73459 5.47228,13.20713 5.47294,5.47261 "+
                "13.20726,5.47261 7.73499,0 13.20727,-5.47261 5.47228,-5.47254 5.47228,-13.20713 z M 600.35548,644.4284 q 0,-7.73459 -5.47294,-13.2072 "+
                "-5.47228,-5.47254 -13.20727,-5.47254 -7.73432,0 -13.20726,5.47254 -5.47228,5.47261 -5.47228,13.2072 0,7.73459 5.47228,13.20713 5.47294,5.47254 "+
                "13.20726,5.47254 7.73499,0 13.20727,-5.47254 5.47294,-5.47254 5.47294,-13.20713 z m 112.07792,56.03916 q 0,-7.7346 -5.47228,-13.20714 "+
                "-5.47294,-5.4726 -13.20727,-5.4726 -7.73432,0 -13.20726,5.4726 -5.47228,5.47254 -5.47228,13.20714 0,7.73459 5.47228,13.20713 5.47294,5.47261 "+
                "13.20726,5.47261 7.73433,0 13.20727,-5.47261 5.47228,-5.47254 5.47228,-13.20713 z M 656.39411,644.4284 q 0,-7.73459 -5.47228,-13.2072 "+
                "-5.47228,-5.47254 -13.20727,-5.47254 -7.73432,0 -13.20726,5.47254 -5.47228,5.47261 -5.47228,13.2072 0,7.73459 5.47228,13.20713 5.47294,5.47254 "+
                "13.20726,5.47254 7.73499,0 13.20727,-5.47254 5.47228,-5.47254 5.47228,-13.20713 z m -56.03863,-56.03922 q 0,-7.73453 -5.47294,-13.20714 "+
                "-5.47228,-5.47254 -13.20727,-5.47254 -7.73432,0 -13.20726,5.47254 -5.47228,5.47261 -5.47228,13.20714 0,7.73459 5.47228,13.2072 5.47294,5.47254 "+
                "13.20726,5.47254 7.73499,0 13.20727,-5.47254 5.47294,-5.47261 5.47294,-13.2072 z M 712.4334,644.4284 q 0,-7.73459 -5.47228,-13.2072 "+
                "-5.47294,-5.47254 -13.20727,-5.47254 -7.73432,0 -13.20726,5.47254 -5.47228,5.47261 -5.47228,13.2072 0,7.73459 5.47228,13.20713 5.47294,5.47254 "+
                "13.20726,5.47254 7.73433,0 13.20727,-5.47254 5.47228,-5.47254 5.47228,-13.20713 z m -56.03929,-56.03922 q 0,-7.73453 -5.47228,-13.20714 "+
                "-5.47228,-5.47254 -13.20727,-5.47254 -7.73432,0 -13.20726,5.47254 -5.47228,5.47261 -5.47228,13.20714 0,7.73459 5.47228,13.2072 5.47294,5.47254 "+
                "13.20726,5.47254 7.73499,0 13.20727,-5.47254 5.47228,-5.47261 5.47228,-13.2072 z M 768.47268,700.46756 V 644.4284 q 0,-7.58871 -5.54541,-13.13419 "+
                " -5.54542,-5.54555 -13.13413,-5.54555 -7.58871,0 -13.13412,5.54555 -5.54608,5.54548 -5.54608,13.13419 v 56.03916 q 0,7.58864 5.54608,13.13419 "+
                "5.54541,5.54555 13.13412,5.54555 7.58871,0 13.13413,-5.54555 5.54541,-5.54555 5.54541,-13.13419 z M 712.4334,588.38918 q 0,-7.73453 -5.47228,-13.20714 "+
                " -5.47294,-5.47254 -13.20727,-5.47254 -7.73432,0 -13.20726,5.47254 -5.47228,5.47261 -5.47228,13.20714 0,7.73459 5.47228,13.2072 5.47294,5.47254 "+
                " 13.20726,5.47254 7.73433,0 13.20727,-5.47254 5.47228,-5.47261 5.47228,-13.2072 z m 56.03928,-46.69926 v -37.35948 q 0,-3.79429 -2.7727,-6.56706 "+
                " -2.77271,-2.77278 -6.5674,-2.77278 H 572.33584 q -3.79469,0 -6.5674,2.77278 -2.77271,2.77277 -2.77271,6.56706 v 37.35948 q 0,3.79429 2.77271,6.56707"+
                " 2.77271,2.77277 6.5674,2.77277 h 186.79674 q 3.79469,0 6.5674,-2.77277 2.7727,-2.77278 2.7727,-6.56707 z m 0,46.69926 q 0,-7.73453 -5.47227,-13.20714"+
                " -5.47294,-5.47254 -13.20727,-5.47254 -7.73499,0 -13.20726,5.47254 -5.47294,5.47261 -5.47294,13.20714 0,7.73459 5.47294,13.2072 5.47227,5.47254"+
                " 13.20726,5.47254 7.73433,0 13.20727,-5.47254 5.47227,-5.47261 5.47227,-13.2072 z m 18.67955,-93.39858 v 224.1567 q 0,7.58857 -5.54542,13.13412"+
                " -5.54542,5.54555 -13.13413,5.54555 H 562.99573 q -7.58871,0 -13.13412,-5.54555 -5.54542,-5.54555 -5.54542,-13.13412 V 494.9906 q 0,-7.58864 "+
                "5.54542,-13.13419 5.54541,-5.54555 13.13412,-5.54555 h 205.47695 q 7.58871,0 13.13413,5.54555 5.54542,5.54555 5.54542,13.13419 z"
            }
        },
        "functions" : [
            {
                "name"   : "length",
                "args"   : ["none"],
                "comment": "Returns String length",
                "input"  : "string",
                "output" : "number",
                "args"   : []
            },
            {
                "name": "lower",
                "args": ["none"],
                "comment": "Returns string converted to lowercase",
                "input"  : "string",
                "output" : "string",
                "args"   : []
            },
            {
                "name": "upper",
                "args": ["none"],
                "comment": "Returns string converted to uppercase",
                "input"  : "string",
                "output" : "string",
                "args"   : []
            },
            {
                "name": "split",
                "comment": "Returns array of strings split by specified separator. By default, no separator",
                "input"  : "string",
                "output" : "[string]",
                "args": ["string|number"]
            },
            {
                "name": "indexOf",
                "comment": "Returns index corresponding to the first occurence.",
                "input"  : "string",
                "output" : "number",
                "args": ["regex"]
            },
            {
                "name": "match",
                "args": ["regex"],
                "comment": "Returns array of strings split by specified separator. By default, no separator",
                "input"  : "string",
                "output" : "[string]",
                "args": ["regex"]
            },
            {
                "name": "repeat",
                "args": ["number"],
                "comment": "Returns string with the same repeated pattern",
                "input"  : "string",
                "output" : "string",
                "args": ["regex"]
            },
        ]
     },
    'database'     :  {
        "ID"     : "DB___TOK",
        "name"   : "database",
        "comment": "DataBase",
        "props"  : Token.CLOSABLE | Token.CONTAINABLE | Token.LINKABLE | Token.MOVABLE | Token.RENDERABLE | Token.ROTATABLE,
        "knots"  : ["oxxx"],
        "title"  : "Database",
        "input"  : "none",
        "output" : "any",
        "args"   : "none",
        "icon"   :"database",
        "description": {
            "title"  :"",
            "content":""
        },
        "svg"    : {
            "type": "path",
            "data": {
                "d": "m 505.51901,468.37875 q 79.81005,0 149.18082,-14.48031 69.37077,-14.4803 109.44417,-42.76741 v 57.24772 q 0,23.23582 -34.68538,43.10415 -34.68539,19.86832 -94.29037,31.48624 -59.60498,11.61792 -129.64924,11.61792 -70.04427,0 -129.64925,-11.61792 -59.60498,-11.61792 -94.29037,-31.48624 -34.68538,-19.86833 -34.68538,-43.10415 v -57.24772 q 40.0734,28.28711 109.44417,42.76741 69.37077,14.48031 149.18083,14.48031 z m 0,258.62498 q 79.81005,0 149.18082,-14.48031 69.37077,-14.4803 109.44417,-42.76741 v 57.24772 q 0,23.23584 -34.68538,43.10416 -34.68539,19.86833 -94.29037,31.48625 -59.60498,11.61792 -129.64924,11.61792 -70.04427,0 -129.64925,-11.61792 -59.60498,-11.61792 -94.29037,-31.48625 -34.68538,-19.86832 -34.68538,-43.10416 v -57.24772 q 40.0734,28.28711 109.44417,42.76741 69.37077,14.48031 149.18083,14.48031 z m 0,-129.3125 q 79.81005,0 149.18082,-14.48031 69.37077,-14.4803 109.44417,-42.76741 v 57.24772 q 0,23.23584 -34.68538,43.10417 -34.68539,19.86832 -94.29037,31.48624 -59.60498,11.61792 -129.64924,11.61792 -70.04427,0 -129.64925,-11.61792 -59.60498,-11.61792 -94.29037,-31.48624 -34.68538,-19.86833 -34.68538,-43.10417 v -57.24772 q 40.0734,28.28711 109.44417,42.76741 69.37077,14.48031 149.18083,14.48031 z m 0,-387.93748 q 70.04426,0 129.64924,11.61792 59.60498,11.61792 94.29037,31.48625 34.68538,19.86832 34.68538,43.10416 v 43.10417 q 0,23.23584 -34.68538,43.10416 -34.68539,19.86833 -94.29037,31.48625 -59.60498,11.61792 -129.64924,11.61792 -70.04427,0 -129.64925,-11.61792 -59.60498,-11.61792 -94.29037,-31.48625 -34.68538,-19.86832 -34.68538,-43.10416 v -43.10417 q 0,-23.23584 34.68538,-43.10416 34.68539,-19.86833 94.29037,-31.48625 59.60498,-11.61792 129.64925,-11.61792 z"
            }
        },
    },
    'filter'       :  {
        "ID"     : "FILT_TOK",
        "name"   : "filter",
        "comment": "Filter Function",
        "props"  : Token.CLOSABLE | Token.CONTAINABLE | Token.LINKABLE | Token.MOVABLE | Token.RENDERABLE | Token.ROTATABLE,
        "knots"  : ["ooxi","oxoi","oixo"],
        "title"  : "Filter",
        "svg"    : {
            "type": "path",
            "data": {
                "d": "m 504.63961,649.89847 c -4.67267,0.069 -9.28809,2.06185 -12.5425,5.41555 -3.25442,3.3537 -5.10769,8.02692 -5.03629,12.69954 l 0,17.96612 c 0,4.67233 1.92342,9.31587 5.22725,12.61969 3.30382,3.30384 7.94737,5.22725 12.61969,5.22725 4.67232,0 9.31587,-1.92341 12.61969,-5.22725 3.30383,-3.30382 5.22725,-7.94736 5.22725,-12.61969 l 0,-17.96612 c 0.0728,-4.76202 -1.85677,-9.52301 -5.22443,-12.89066 -3.36765,-3.36765 -8.12864,-5.29723 -12.89066,-5.22443 z m 0,-72.81792 c -4.66762,0.069 -9.27818,2.05761 -12.53184,5.40502 -3.25366,3.34741 -5.11048,8.01259 -5.04695,12.68028 l 0,17.96613 c 0,4.67232 1.92342,9.31586 5.22725,12.61969 3.30382,3.30383 7.94737,5.22724 12.61969,5.22724 4.67232,0 9.31587,-1.92341 12.61969,-5.22724 3.30383,-3.30383 5.22725,-7.94737 5.22725,-12.61969 l 0,-17.96613 c 0.0647,-4.7571 -1.86839,-9.50993 -5.23525,-12.87124 -3.36685,-3.36132 -8.12286,-5.28666 -12.87984,-5.21406 z M 263.95912,275.4106 l 0,13.43734 481.86748,0 0,-13.43734 z m 334.92069,119.59537 c -28.18911,-0.007 -63.1361,0.0602 -97.99432,0.14898 -69.71643,0.17761 -139.06035,0.42613 -152.93549,0.32774 -1.36015,-0.009 -2.41458,1.66796 -1.81747,2.89007 7.06543,14.64754 60.38661,113.87443 95.10425,152.66734 0.0547,0.0735 0.11451,0.14323 0.17876,0.20857 0.0195,0.0203 0.0393,0.0401 0.0596,0.0596 34.95611,36.03386 83.80983,34.93109 115.24538,1.01301 31.20981,-33.67443 85.19841,-125.35751 101.3611,-154.0081 0.69136,-1.20215 -0.31183,-2.97973 -1.69829,-3.00925 -7.88437,-0.21409 -29.31439,-0.29172 -57.50351,-0.29795 z M 231.06592,230.71875 c -3.12345,0.003 -6.18515,1.78068 -7.73611,4.49186 -1.55096,2.71118 -1.53153,6.25151 0.0491,8.94549 l 178.58861,303.66619 0,242.28939 c -0.004,2.33625 0.95351,4.65985 2.60272,6.31458 1.64922,1.65474 3.96961,2.62023 6.30586,2.62379 l 112.02756,0 c 2.51457,-0.002 5.00751,-1.12616 6.67398,-3.00925 l 64.44564,-72.63914 c 1.40316,-1.58856 2.21162,-3.69054 2.23459,-5.80994 l 1.93667,-169.62046 188.12287,-303.63639 c 1.66314,-2.68846 1.74406,-6.28077 0.20367,-9.04139 -1.54039,-2.76062 -4.63998,-4.57824 -7.80128,-4.57473 z m 15.61236,17.84694 515.98225,0 -180.94238,292.1357 c -0.8507,1.37057 -1.31963,2.97539 -1.34076,4.58836 l -1.93665,168.78621 -59.52953,67.12715 -99.09672,0 0,-235.82397 c -9.6e-4,-1.5722 -0.42753,-3.14204 -1.22158,-4.49898 z"
            }
        },
    },
    'fold'         :  {
        "ID"    : "FOLD_TOK",
        "name"   : "fold",
        "comment": "Fold/Reduce Function",
        "props"  : Token.CLOSABLE | Token.CONTAINABLE | Token.LINKABLE | Token.MOVABLE | Token.RENDERABLE | Token.ROTATABLE,
        "knots"  : ["ooxi","oxoi","oixo"],
        "title"  : "Fold/Reduce",
        "svg"    : {
            "type": "path",
            "data": {
                "d": "m 369.00051,221.69657 317.94941,97.20689 -18.80395,61.50497 -317.94942,-97.20689 z "+
                "m -35.3345,173.8297 332.56116,0 0,61.87184 -332.56116,0 z m 0,82.31165 332.56116,0 0,64.63398 -332.56116,0 z "+
                "m 0.50832,85.28921 332.05284,-0.21543 0,61.87185 -332.56116,0 z m -133.09084,-11.8164 66.84369,0 0,199.42621 "+
                "464.59125,0 0,-199.42621 67.39612,0 0,264.61262 -598.83106,0 z m 132.58252,97.77961 332.56116,0 0,62.9767 -332.56116,0 z"
            }
        },
    },
    'function'     :  {
        "ID"    : "FUNC_TOK",
        "name"   : "function",
        "comment": "Function f(x)",
        "props"  : Token.CLOSABLE | Token.CONTAINABLE | Token.LINKABLE | Token.MOVABLE | Token.RENDERABLE | Token.ROTATABLE,
        "knots"  : ["oxix","oixx","oxxi"],
        "title"  : "Function f(x)",
        "svg"    : {
            "type": "circle",
            "data": {"r": 200, "cx": 500, "cy": 500, "fill": "green"}
        },
    },
    'hub'          :  {
         "ID"    : "HUB__TOK",
        "name"   : "hub",
        "comment": "Hub used to insert additional inputs in the flow",
        "props"  : Token.CLOSABLE | Token.CONTAINABLE | Token.LINKABLE | Token.MOVABLE | Token.RENDERABLE | Token.ROTATABLE,
        "knots"  : ["oxix","oixx","oxxi","oxii","oixi","oiii"],
        "title"  : "Hub",
        "svg"    : {
            "type": "g",
            "data": {},
            "children" : [
                {"type": "circle", "data": {"r": 95, "cx": 500, "cy": 500, "fill": "none","stroke": "#000000","stroke-width": 32.0} },
                {"type": "circle", "data": {"r": 75, "cx": 750, "cy": 500, "fill": "#000000"} },
                {"type": "circle", "data": {"r": 75, "cx": 250, "cy": 500, "fill": "#000000"} },
                {"type": "circle", "data": {"r": 75, "cx": 500, "cy": 750, "fill": "#000000"} },
                {"type": "circle", "data": {"r": 75, "cx": 500, "cy": 250, "fill": "#000000"} }
            ]
        },
    },
    'if_then_else' :  {
         "ID"    : "IFTH_TOK",
        "name"   : "if_then_else",
        "comment": "if_then_else works as a predicate: a function returning a boolean (true or false)",
        "props"  : Token.CLOSABLE | Token.CONTAINABLE | Token.LINKABLE | Token.MOVABLE | Token.RENDERABLE | Token.ROTATABLE,
        "knots"  : ["ooxi","ooxi"],
        "title"  : "IF (condition) THEN return true ELSE return false",
        "input"  : "any",
        "output" : "boolean",
        "args"   : "none",
        "svg"    : {
            "type": "path",
            "data": {
                "d": "M 679.02981,390.40264 572.5745,585.57093 h 212.91063 z m -354.85125,0 -106.45531,195.16829 h 212.90999 z m 227.60353,-53.22772 "+
                "q -3.88116,11.08914 -12.6136,19.82184 -8.73308,8.73263 -19.82228,12.61385 v 357.90088 h 168.55446 q 3.88115,0 6.37632,2.49504 "+
                "2.49517,2.49504 2.49517,6.37626 v 17.7426 q 0,3.88122 -2.49517,6.37625 -2.49517,2.49498 -6.37632,2.49498 h -372.5936 q -3.88116,0 "+
                "-6.37632,-2.49498 -2.49517,-2.49503 -2.49517,-6.37625 v -17.7426 q 0,-3.88122 2.49517,-6.37626 2.49516,-2.49504 6.37632,-2.49504 "+
                "H 483.86153 V 369.61061 q -11.0892,-3.88122 -19.82228,-12.61385 -8.73245,-8.7327 -12.6136,-19.82184 H 315.30707 q -3.88116,0 "+
                "-6.37632,-2.49504 -2.49517,-2.49504 -2.49517,-6.37626 v -17.74246 q 0,-3.88122 2.49517,-6.37633 2.49516,-2.49503 6.37632,-2.49503 "+
                "h 136.11858 q 5.82205,-15.80196 19.40578,-25.64351 13.58437,-9.84162 30.77307,-9.84162 17.18744,0 30.77181,9.84162 13.58373,9.84155 "+
                "19.40578,25.64351 h 136.11858 q 3.88115,0 6.37632,2.49503 2.49517,2.49511 2.49517,6.37633 v 17.74246 q 0,3.88122 -2.49517,6.37626 "+
                "-2.49517,2.49504 -6.37632,2.49504 H 551.78209 z m -50.17759,4.43568 q 9.14831,0 15.66304,-6.51479 6.51473,-6.51492 6.51473,-15.66342 "+
                "0,-9.1485 -6.51473,-15.66335 -6.51473,-6.51486 -15.66304,-6.51486 -9.14894,0 -15.6643,6.51486 -6.51473,6.51485 -6.51473,15.66335 "+
                "0,9.1485 6.51473,15.66342 6.51536,6.51479 15.6643,6.51479 z m 301.62297,243.96033 q 0,20.23763 -12.89105,36.31684 -12.89106,16.07922 "+
                "-32.57429,25.22771 -19.68261,9.14856 -40.05916,13.72278 -20.37654,4.57428 -38.67316,4.57428 -18.29724,0 -38.67379,-4.57428 "+
                "-20.37591,-4.57422 -40.05915,-13.72278 -19.6826,-9.14849 -32.57366,-25.22771 -12.89168,-16.07921 -12.89168,-36.31684 0,-3.0495 "+
                "9.70321,-22.45541 9.70321,-19.40591 25.50528,-48.37624 15.80145,-28.97034 29.66327,-54.19805 13.86118,-25.22764 28.27664,-51.00988 "+
                "14.41608,-25.78217 15.52526,-27.72274 4.99033,-9.1485 15.52462,-9.1485 10.53494,0 15.52463,9.1485 1.10918,1.94057 15.52526,27.72274 "+
                "14.41546,25.78224 28.27664,51.00988 13.86119,25.22771 29.6639,54.19805 15.80144,28.97033 25.50465,48.37624 9.70258,19.40591 9.70258,22.45541 z"+
                " m -354.85126,0 q 0,20.23763 -12.89105,36.31684 -12.89042,16.07922 -32.57429,25.22771 -19.6826,9.14856 -40.05915,13.72278 "+
                "-20.37655,4.57428 -38.67316,4.57428 -18.29725,0 -38.6738,-4.57428 -20.37528,-4.57422 -40.05915,-13.72278 -19.6826,-9.14849 "+
                "-32.57429,-25.22771 -12.89105,-16.07921 -12.89105,-36.31684 0,-3.0495 9.70257,-22.45541 9.70321,-19.40591 25.50529,-48.37624 "+
                "15.80208,-28.97034 29.66327,-54.19805 13.86182,-25.22764 28.2779,-51.00988 14.41546,-25.78217 15.524,-27.72274 4.98969,-9.1485 "+
                "15.52526,-9.1485 10.53493,0 15.52463,9.1485 1.10917,1.94057 15.52462,27.72274 14.41546,25.78224 28.27728,51.00988 13.86118,25.22771 "+
                "29.66326,54.19805 15.80208,28.97033 25.50529,48.37624 9.70257,19.40591 9.70257,22.45541 z"
            }
        },
    },
    'input_cloud'  :  {
         "ID"    : "CLUD_TOK",
        "name"   : "input_cloud",
        "comment": "Input obtained from the cloud",
        "props"  : Token.CLOSABLE | Token.CONTAINABLE | Token.LINKABLE | Token.MOVABLE | Token.RENDERABLE | Token.ROTATABLE,
        "knots"  : ["oxxx"],
        "title"  : "Input from the Cloud",
        "svg"    : {
            "type": "path",
            "data": {
                "d": "m 598.96942,529.62308 q 0,-4.37584 -2.81303,-7.18887 -2.81304,-2.81303 -7.18887,-2.81303 H 518.95427 V 409.60035 q 0,-4.06327 "+
                "-2.96931,-7.03258 -2.96931,-2.96931 -7.03258,-2.96931 h -60.01136 q -4.06327,0 -7.03258,2.96931 -2.96932,2.96931 -2.96932,7.03258 "+
                "v 110.02083 h -70.01325 q -4.06327,0 -7.03258,2.96932 -2.96931,2.9693 -2.96931,7.03258 0,4.37582 2.81303,7.18885 l 110.02082,110.02082 "+
                "q 2.81304,2.81303 7.18887,2.81303 4.37583,0 7.18886,-2.81303 L 595.84383,537.12449 q 3.12559,-3.75071 3.12559,-7.50141 z m 200.03788,70.01324 "+
                "q 0,49.6969 -35.16291,84.85981 -35.16291,35.16291 -84.85982,35.16291 H 338.92019 q -57.82345,0 -98.92498,-41.10154 -41.10153,-41.10153 "+
                "-41.10153,-98.92496 0,-40.63269 21.87914,-75.0142 21.87914,-34.38151 58.76112,-51.57226 -0.62512,-9.37678 -0.62512,-13.44004 0,-66.26255"+
                " 46.88388,-113.14643 46.88388,-46.88388 113.14642,-46.88388 48.75923,0 89.23565,27.19265 40.47641,27.19265 58.9174,72.20117 22.1917,-19.37867"+
                " 51.88482,-19.37867 33.13129,0 56.57322,23.44194 23.44194,23.44194 23.44194,56.57322 0,23.75449 -12.81493,43.13316 40.6327,9.68933 "+
                "66.73139,42.35177 26.09869,32.66243 26.09869,74.54535 z"
            }
        },
    },
    'input_new'  : {
         "ID"    : "INEW_TOK",
        "name"   : "input_new",
        "comment": "Input with creation of a new variable from other input",
        "props"  : Token.CLOSABLE | Token.CONTAINABLE | Token.LINKABLE | Token.MOVABLE | Token.RENDERABLE | Token.ROTATABLE,
        "knots"  : ["xoxi","oxix","oixx","oxxi"],
        "title"  : "Input with Creation",
        "svg"    : {
            "type": "circle",
            "data": {"r": 200, "cx": 500, "cy": 500, "fill": "green"}
        },
    },
    'input_ro'   :  {
         "ID"    : "INRO_TOK",
        "name"   : "input_ro",
        "comment": "Input Read Only",
        "props"  : Token.CLOSABLE | Token.CONTAINABLE | Token.LINKABLE | Token.MOVABLE | Token.RENDERABLE | Token.ROTATABLE,
        "knots"  : ["oxxx"],
        "title"  : "Input Read Only",
        "svg"    : {
            "type": "path",
            "data": {
                "d": "m 335.43334,733.61364 320.22833,0 m -320.22833,41.36311 320.22833,0 m -320.22833,-124.08914 320.22833,0 m -320.22833,41.36311 "+
                "320.22833,0 m -320.22833,-124.08915 320.22833,0 m -320.22833,41.36312 320.22833,0 M 335.43334,485.4355 l 320.22833,0 m -320.22833,41.36312 "+
                "320.22833,0 m -320.22833,-124.08911 320.22833,0 m -320.22833,41.363 320.22833,0 m -359.56677,-189.8327 277.71756,3.7e-4 138.85878,107.73972 "+
                "0,479.93315 -416.57634,0 z",
                "fill":"none",
                "stroke": "#000000",
                "stroke-width": 18.0
            }
        },
    },
    'input_rw'   :  {
         "ID"    : "INRW_TOK",
        "name"   : "input_rw",
        "comment": "Input Read/Write",
        "props"  : Token.CLOSABLE | Token.CONTAINABLE | Token.LINKABLE | Token.MOVABLE | Token.RENDERABLE | Token.ROTATABLE,
        "knots"  : ["oxxx"],
        "title"  : "Input Read/Write",
        "svg"    : {
            "type": "path",
            "data": {
                "d": "m 531.85745,688.6404 -39.05459,27.7004 10.92427,-24.3802 -20.99778,-21.201 z M 703.091,211.7641 554.59196,619.7612 "+
                "M 663.83277,197.47528 515.33333,605.4742 m 61.40919,51.3923 -86.38484,72.486 -19.58154,-111.0544 z m 60.92761,-466.62006 "+
                "84.60513,30.79375 c 7.18057,2.61352 10.83704,10.55392 8.19835,17.80363 L 583.34322,643.0813 c -2.6387,7.2494 -10.54364,10.9817 "+
                "-17.72421,8.3681 l -84.60513,-30.7938 c -7.18056,-2.613 -10.8371,-10.5534 -8.1984,-17.8031 l 147.1304,-404.23751 c 2.63868,-7.24971 "+
                "10.54369,-10.98207 17.72425,-8.36855 z M 347.33537,705.7491 484.90197,704.945 m 34.66193,0.2665 148.14419,-0.4615 m -320.24155,42.9091 "+
                "320.37272,-1.0036 m -320.76638,-124.7122 128.07381,-0.403 m 116.40762,-0.364 75.89123,-0.2405 m -320.24149,42.9091 132.08802,-0.416 "+
                "m 86.302,-0.273 101.98271,-0.3185 M 346.81046,538.1247 496.96165,537.6548 m 124.43563,-0.39 45.78581,-0.1437 m -320.24131,42.9085 "+
                "134.09492,-0.4199 m 124.43562,-0.39 61.84198,-0.1937 m -320.76629,-124.71271 180.25656,-0.5642 m 124.43564,-0.38935 15.68041,-0.052 "+
                "m -320.2414,42.90871 164.20039,-0.51415 m 126.44264,-0.39585 29.72962,-0.093 M 346.28555,370.50093 556.64751,369.84222 "+
                "m -210.23074,42.56401 195.93699,-0.6136 m 162.58496,-101.96192 18.62548,18.22476 1.52267,486.22463 -416.76412,1.3052 -1.86442,-595.37718 "+
                "277.8427,-0.86996 21.48811,16.76409",
                "fill":"none",
                "stroke": "#000000",
                "stroke-width": 18.0,
                "stroke-linejoin":"round"
            }
        },
    },
    'input_start'     :  {
         "ID"    : "INST_TOK",
        "name"   : "input_start",
        "comment": "Input starting the processing main flow",
        "props"  : Token.CLOSABLE | Token.CONTAINABLE | Token.LINKABLE | Token.MOVABLE | Token.RENDERABLE | Token.ROTATABLE,
        "knots"  : ["oxxx"],
        "title"  : "Input Start",
        "svg"    : {
            "type": "path",
            "data": {
                "d":"m 314.0625,721.25 0,12 346.875,0 0,-12 -346.875,0 z m 61.71875,-96 0,12 285.15625,0 0,-12 -285.15625,0 z m -61.71875,64 0,12 346.875,0 0,-12 -346.875,0 z m 62.5,-96 0,12 284.375,0 0,-12 -284.375,0 z m -0.375,64 0,12 284.75,0 0,-12 -284.75,0 z M 348.25,355.3125 q 0,15.75 -14,24.0625 v 276.9375 q 0,2.84375 -2.07812,4.92188 -2.07813,2.07812 -4.92188,2.07812 h -14 q -2.84375,0 -4.92187,-2.07812 Q 306.25,659.15625 306.25,656.3125 V 379.375 q -14,-8.3125 -14,-24.0625 0,-11.59375 8.20313,-19.79687 8.20312,-8.20313 19.79687,-8.20313 11.59375,0 19.79687,8.20313 8.20313,8.20312 8.20313,19.79687 z m 322,14 v 166.90625 q 0,5.46875 -2.73438,8.42188 -2.73437,2.95312 -8.64062,6.01562 -47.03125,25.375 -80.71875,25.375 -13.34375,0 -27.01563,-4.8125 -13.67187,-4.8125 -23.73437,-10.5 -10.0625,-5.6875 -25.26562,-10.5 -15.20313,-4.8125 -31.17188,-4.8125 -42,0 -101.5,31.9375 -3.71875,1.96875 -7.21875,1.96875 -5.6875,0 -9.84375,-4.15625 Q 348.25,571 348.25,565.3125 V 403 q 0,-7 6.78125,-12.03125 4.59375,-3.0625 17.28125,-9.40625 51.625,-26.25 92.09375,-26.25 23.40625,0 43.75,6.34375 20.34375,6.34375 47.90625,19.25 8.3125,4.15625 19.25,4.15625 11.8125,0 25.70313,-4.59375 13.89062,-4.59375 24.0625,-10.28125 10.17187,-5.6875 19.25,-10.28125 9.07812,-4.59375 11.92187,-4.59375 5.6875,0 9.84375,4.15625 4.15625,4.15625 4.15625,9.84375 z M 252.1875,203.875 a 9.0009,9.0009 0 0 0 -9,8.96875 L 241.90625,814.375 a 9.0009,9.0009 0 0 0 9,9 l 485.03125,0 a 9.0009,9.0009 0 0 0 9,-9 l 0,-472.625 a 9.0009,9.0009 0 0 0 -2.34375,-6.03125 l -116.6875,-128.4375 a 9.0009,9.0009 0 0 0 -6.625,-2.9375 L 252.1875,203.875 z m 8.96875,18 354.09375,0.46875 111.6875,122.875 0,460.15625 -467,0 1.21875,-583.5 z"
            }
        },
    },
    'map'          : {
         "ID"    : "MAP__TOK",
        "name"   : "map",
        "comment": "Map Function",
        "props"  : Token.CLOSABLE | Token.CONTAINABLE | Token.LINKABLE | Token.MOVABLE | Token.SWITCHABLE | Token.RENDERABLE | Token.ROTATABLE,
        "knots"  : ["ooxi","oxoi","oixo"],
        "title"  : "Map Function",
        "input"  : "[any]",
        "output" : "[any]",
        "args"   : ["function"],
        "icon"   : "map",
        "description": {
            "title":"",
            "content":""
        },
        "svg"    : {
            "type": "path",
            "data": {
                "d": "m 792.14871,269.92516 q 8.04615,5.74725 8.04615,15.23021 v 404.60782 q 0,5.74725 -3.16092,10.34511 -3.16091,4.59771 -8.3332,6.60935 "+
                "l -183.91326,73.56503 q -6.8966,3.16099 -13.79321,0 L 413.97829,709.59124 236.96231,780.28268 q -2.87385,1.43679 -6.8966,1.43679 "+
                "-5.46001,0 -10.34524,-3.16104 -8.04615,-5.74726 -8.04615,-15.2302 V 358.7204 q 0,-5.74726 3.16092,-10.34504 3.16091,-4.59779 8.33386,-6.60936 "+
                "l 183.91259,-73.56509 q 6.8966,-3.16092 13.79321,0 l 177.01598,70.6915 177.01598,-70.6915 q 9.19569,-3.73569 17.24185,1.72425 z "+
                "m -368.97472,38.79402 v 364.95164 l 165.5212,66.09358 V 374.81277 z m -174.7169,62.3579 V 736.02865 L 404.7826,673.67082 "+
                "V 308.71918 z M 763.41273,677.40657 V 312.45493 L 607.08658,374.81277 V 739.7644 z"
            }
        },
     },
    'return_filter': {
         "ID"    : "UFLT_TOK",
        "name"   : "return_filter",
        "comment": "Returns to the next Filter Token. This token defines a secondary route (aka a function used as argument)",
        "props"  : Token.CLOSABLE | Token.CONTAINABLE | Token.LINKABLE | Token.MOVABLE | Token.RENDERABLE | Token.ROTATABLE,
        "knots"  : ["xixx"],
        "title"  : "Return to Filter",
        "svg"    : {
            "type": "circle",
            "data": {"r": 200, "cx": 500, "cy": 500, "fill": "green"}
        },
    },
    'return_fold'  : {
         "ID"    : "UFLD_TOK",
        "name"   : "return_fold",
        "comment": "Returns to the next Fold/Reduce Token. This token defines a secondary route (aka a function used as argument)",
        "props"  : Token.CLOSABLE | Token.CONTAINABLE | Token.LINKABLE | Token.MOVABLE | Token.RENDERABLE | Token.ROTATABLE,
        "knots"  : ["xixx"],
        "title"  : "Return to Fold/Reduce",
        "svg"    : {
            "type": "circle",
            "data": {"r": 200, "cx": 500, "cy": 500, "fill": "green"}
        },
    },
    'return_map'   : {
         "ID"    : "UMAP_TOK",
        "name"   : "return_map",
        "comment": "Returns to the next Map Token. This token defines a secondary route (aka a function used as argument)",
        "props"  : Token.CLOSABLE | Token.CONTAINABLE | Token.LINKABLE | Token.MOVABLE | Token.RENDERABLE | Token.ROTATABLE,
        "knots"  : ["xixx"],
        "title"  : "Return to Map",
        "svg"    : {
            "type": "path",
            "data": {
                "d": "m 755.34959,571.95792 q 3.8657,2.76088 3.8657,7.31724 v 194.3916 q 0,2.76147 -1.5184,4.97052 -1.51898,2.20906 "+
                "-4.00394,3.17505 l -88.35988,35.34429 q -3.31328,1.5184 -6.62716,0 l -85.046,-33.96356 -85.04657,33.96356 q -1.38074,0.69007 "+
                "-3.31329,0.69007 -2.62322,0 -4.97053,-1.51898 -3.8657,-2.76088 -3.8657,-7.31665 V 614.61888 q 0,-2.76089 1.5184,"+
                "-4.96993 1.51898,-2.20906 4.00395,-3.17563 l 88.35987,-35.34372 q 3.31387,-1.51899 6.62717,0 l 85.04658,33.96298 85.04599,-33.96298 "+
                "q 4.41811,-1.79489 8.28381,0.82832 z m -177.27215,18.63844 v 175.339 l 79.52423,31.75451 V 622.35086 z m -83.94176,29.95961 "+
                "v 175.33901 l 75.10613,-29.95962 v -175.339 z m 247.40775,147.17428 v -175.339 l -75.10612,29.95961 V 797.68987 z "+
                "M 481.68485,181.78513 c -53.46223,-0.63158 -108.05054,15.52542 -151.39625,52.24987 -43.34511,36.72445 -72.18986,95.40357 "+
                "-72.18986,163.95106 l 0,401.20034 59.08147,-59.08145 59.08145,59.08145 0,-401.20034 c 0,-38.17667 12.24936,-58.41975 30.46418,-73.85182 "+
                "18.21422,-15.43208 45.47914,-24.51941 73.6669,-24.18618 28.18776,0.33085 55.59388,10.22522 73.48257,25.84813 21.4129,25.01096 "+
                "28.52867,48.38831 28.24803,72.18987 l 0,38.86438 -59.08147,-0.2186 118.16293,121.79643 118.16292,-122.70924 -59.08146,-0.80824 "+
                "0,-36.92591 C 700.4635,345.35865 671.19869,273.35253 631.60524,236.80356 589.22079,199.78725 535.14885,182.41553 481.68603,181.78395 z"
            }
        },
    },
    'settings'     : {
         "ID"    : "SETT_TOK",
        "name"   : "settings",
        "comment": "Settings used by some tool",
        "props"  : Token.CLOSABLE | Token.CONTAINABLE | Token.LINKABLE | Token.MOVABLE | Token.RENDERABLE | Token.ROTATABLE,
        "knots"  : ["oxxx"],
        "title"  : "Settings",
        "svg"    : {
            "type": "circle",
            "data": {"r": 200, "cx": 500, "cy": 500, "fill": "green"}
        },
    },
    'search'       : {
         "ID"    : "SRCH_TOK",
        "name"   : "search",
        "comment": "Search. Accepts a Regex as argument",
        "props"  : Token.CLOSABLE | Token.CONTAINABLE | Token.LINKABLE | Token.MOVABLE | Token.RENDERABLE | Token.ROTATABLE,
        "knots"  : ["xoxi","oxix","oixx","oxxi"],
        "title"  : "Search",
        "svg"    : {
            "type": "path",
            "data": {
                "d": "m 616.24252,469.45901 q 0,-66.75098 -47.44781,-114.19836 -47.44709,-47.4473 -114.19829,-47.4473 -66.75047,0 -114.19828,47.4473 -47.44709,47.44738 -47.44709,114.19836 0,66.75098 47.44709,114.19828 47.44781,47.4473 114.19828,47.4473 66.7512,0 114.19829,-47.4473 47.44781,-47.4473 47.44781,-114.19828 z m 184.73735,300.19898 q 0,18.76244 -13.71072,32.47345 -13.71145,13.71101 -32.47367,13.71101 -19.48377,0 -32.47368,-13.71101 L 598.5626,678.73236 q -64.58657,44.74116 -143.96618,44.74116 -51.59667,0 -98.68298,-20.02528 -47.08632,-20.02529 -81.18346,-54.12243 -34.09714,-34.09714 -54.12278,-81.1836 -20.02493,-47.08653 -20.02493,-98.6832 0,-51.59675 20.02493,-98.68321 20.02564,-47.08653 54.12278,-81.18367 34.09714,-34.09714 81.18346,-54.12242 47.08631,-20.02529 98.68298,-20.02529 51.59667,0 98.68371,20.02529 47.08632,20.02528 81.18324,54.12242 34.09714,34.09714 54.12207,81.18367 20.02564,47.08646 20.02564,98.68321 0,79.37953 -44.74131,143.9656 l 123.76015,123.75992 q 13.34995,13.35024 13.34995,32.47346 z"
            }
        },
    },
    'view'         : {
        "ID"     : "VIEW_TOK",
        "name"   : "view",
        "comment": "-",
        "props"  : Token.CLOSABLE | Token.CONTAINABLE | Token.LINKABLE | Token.MOVABLE | Token.SWITCHABLE | Token.RENDERABLE | Token.ROTATABLE,
        "knots"  : ["ixxx"],
        "title"  : "View",
        "input"  : "any",
        "output" : "none",
        "args"   : "none",
        "icon"   : "view_blue",
        "description": {
            "title": "View",
            "content": "This token triggers the execution of the flow and display results in console."
        },
        "svg"    : {
            "type": "g",
            "data" : {
                   "transform":"matrix(2.7482689,0,0,2.7139297,-1125.1904,-2447.1003)"
            },
            "children": [
                {
                    "type": "path",
                    "data": {
                        "d": "m 991.95406,867.87939 c 0,59.35475 -48.11653,107.47127 -107.47127,107.47127 -59.35474,0 -107.47127,-48.11652 "+
                        "-107.47127,-107.47127 0,-59.35474 48.11653,-107.47126 107.47127,-107.47126 59.35474,0 107.47127,48.11652 107.47127,107.47126 z",
                        "transform":"translate(-292.52876,223.56325)",
                        "fill":"#56daff",
                        "stroke":"#292782",
                        "stroke-width":5
                    }
                },
                {
                    "type": "path",
                    "data": {
                        "d":"m -113,916.73 -29.42563,-38.67089 11.12176,47.3034 -20.74249,-43.94377 1.04379,48.58205 -11.15279,-47.29609 "+
                        "-9.07979,47.73743 -1.07566,-48.58135 -18.80656,44.80646 9.04848,-47.74338 -27.71137,39.91722 18.77715,-44.81878 "+
                        "-35.40506,33.28342 27.68517,-39.9354 -41.55139,25.19497 35.38322,-33.30664 -45.88173,16.00538 41.53486,-25.22223 "+
                        "-48.2068,6.11628 45.87121,-16.03548 -48.42502,-4.04014 48.20279,-6.1479 -46.52682,-14.01998 48.42766,4.00837 "+
                        "-42.59519,-23.38708 46.53601,13.98945 -36.80193,-31.73205 42.61052,23.35913 -29.40025,-38.69018 36.82274,31.7079 "+
                        "-20.71365,-43.95737 29.42563,38.67089 -11.12175,-47.3034 20.74248,43.94376 -1.04379,-48.58205 11.15279,47.2961 "+
                        "9.07979,-47.73743 1.07567,48.58135 18.80655,-44.80646 -9.04848,47.74338 27.71137,-39.91722 -18.77715,44.81878 "+
                        "35.40507,-33.28342 -27.68518,39.9354 41.551396,-25.19497 -35.383226,33.30664 45.881728,-16.00538 -41.534858,25.22223 "+
                        "48.206807,-6.11628 -45.871217,16.03548 48.425018,4.04014 -48.202788,6.1479 46.526827,14.01998 -48.427657,-4.00837 "+
                        "42.595182,23.38708 -46.536012,-13.98945 36.801929,31.73205 -42.610519,-23.35913 29.400256,38.69018 -36.822746,-31.7079 z",
                        "transform":"translate(755.17245,257.47127)",
                        "fill":"#7b69ff",
                        "fill-opacity":0.65490196,
                        "stroke":"#292782",
                        "stroke-width":2
                    }
                },
                {
                    "type": "path",
                    "data": {
                        "d":"m 903.44827,727.64954 c 0,28.88385 -23.415,52.29885 -52.29886,52.29885 -28.88385,0 -52.29885,-23.415 -52.29885,-52.29885 "+
                        "0,-28.88386 23.415,-52.29885 52.29885,-52.29885 28.88386,0 52.29886,23.41499 52.29886,52.29885 z",
                        "transform":"matrix(1.0093955,0,0,1.0216813,-267.19236,348.01672)",
                        "fill":"#000304",
                        "stroke":"#000000",
                        "stroke-width":2
                    }
                },
                {
                    "type": "path",
                    "data": {
                        "d":"m 935.63219,826.50012 c 0,13.01361 -10.54961,23.56322 -23.56322,23.56322 -13.01361,0 -23.56322,-10.54961 -23.56322,-23.56322 "+
                        "0,-13.0136 10.54961,-23.56322 23.56322,-23.56322 13.01361,0 23.56322,10.54962 23.56322,23.56322 z",
                        "transform":"translate(-290.22991,232.75866)",
                        "fill":"#ffffff",
                        "stroke":"none"
                    }
                },
                {
                    "type": "path",
                    "data": {
                        "d":"m 935.63219,826.50012 c 0,13.01361 -10.54961,23.56322 -23.56322,23.56322 -13.01361,0 -23.56322,-10.54961 -23.56322,-23.56322 "+
                        "0,-13.0136 10.54961,-23.56322 23.56322,-23.56322 13.01361,0 23.56322,10.54962 23.56322,23.56322 z",
                        "transform":"matrix(1.2439024,0,0,1.2439024,-581.07654,99.564058)",
                        "fill":"#ffffff",
                        "stroke":"none",
                        "fill-opacity": 0.65490196
                    }
                },
            ]
        },
    },
    'view_plot'    : {
        "ID"     : "PLOT_TOK",
        "name"   :"plot",
        "comment": "-",
        "props"  : Token.CLOSABLE | Token.CONTAINABLE | Token.LINKABLE | Token.MOVABLE | Token.SWITCHABLE | Token.RENDERABLE | Token.ROTATABLE,
        "knots"  : ["ixxx"],
        "title"  : "Plot",
        "input"  : "any",
        "output" : "none",
        "args"   : "none",
        "icon"   : "plot_blue",
        "description": {
            "title": "Plot",
            "content": "This token triggers the execution of the flow and displays results as plot."
        },
        "svg"    : {
            "type": "g",
            "data": {},
            "children": [
                {
                    "type": "circle", 
                    "data": {
                        "r": 295,"cx": 500,"cy": 500, 
                        "fill": "#56daff",
                        "stroke": "#292782",
                        "stroke-width": 14.0
                    } 
                },
                {
                    "type": "circle", 
                    "data": {
                        "r": 150, "cx": 500, "cy": 500, 
                        "fill": "#000000",
                        "stroke": "none",
                    } 
                },
                {
                    "type": "circle", 
                    "data": {
                        "r": 64, "cx": 585, "cy": 415, 
                        "fill": "#ffffff",
                        "stroke": "none",
                    } 
                },
                {
                    "type": "circle", 
                    "data": {
                        "r": 80, "cx": 390, "cy": 610, 
                        "fill": "#ffffff",
                        "fill-opacity": 0.7,
                    } 
                }
            ]
        },
    }
    
};



