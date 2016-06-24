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

}

Board.prototype.setViewport = function (w,h) {
    this.viewport.w = w;
    this.viewport.h = h;
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
}

Game.TOKENSIZE = 80;

Game.HOME_FLOW = function () {
    return '../';
};


Game.prototype.add = function (component) {
    this.components.push(component);
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
    {type: 'calcNumber'   , copies: 99},
    {type: 'calcString'   , copies: 99},
    {type: 'database'     , copies: 99},
    {type: 'filter'       , copies: 99},
    {type: 'fold'         , copies: 99},
    {type: 'function'     , copies: 99},
    {type: 'hub'          , copies: 99},
    {type: 'if_then_else' , copies: 99},
    {type: 'input_rw'     , copies: 99},
    {type: 'input_cloud'  , copies: 99},
    {type: 'input_new'    , copies: 99},
    {type: 'map'          , copies: 99},
    {type: 'return_filter', copies: 99},
    {type: 'return_fold'  , copies: 99},
    {type: 'return_map'   , copies: 99},
    {type: 'settings'     , copies: 99},
    {type: 'search'       , copies: 99},
    {type: 'view'         , copies: 1},
    {type: 'view_plot'    , copies: 1}
];

SandBox.prototype.addTokens = function(toks) {
    var tokSet = toks;
    if (toks[0].type.toLowerCase() === 'all') {
        tokSet = SandBox.allTokens;
    }
    
    this.tokens = tokSet.map(
        function(token) {
            var myTok = TokenFactory.get(token);
            return {token: myTok, copies: token.copies};
        }
    );

    console.log(this.tokens);
}

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

function Token(options) {
    // Init
    this.ID = options.ID || -1;
    this.props = options.props || (Token.CLOSABLE | Token.CONTAINABLE | Token.LINKABLE | Token.MOVABLE | Token.RENDERABLE | Token.ROTATABLE);
    this.status = -1;
    this.orgx = options.orgx || 0;
    this.orgy = options.orgy || 0;
    this.width = options.width || Game.TOKENSIZE;
    this.height = options.height || Game.TOKENSIZE;
    this.type = options.type || 'X';
    this.title = options.title || 'No title';
    this.angle = options.angle || 0;
    this.description = options.description  || {title:'None',contents:''};
    this.nodes = options.nodes;
    this.cell_x = (options.cell_x != null) ? options.cell_x : -1;
    this.cell_y = (options.cell_y != null) ? options.cell_y : -1;
    this.knots=options.knots || 'ixox';
    this.background_color=options.background_color || '#FFFFFF';

    this.path_img = Game.HOME_FLOW() +'/images/';
    this.background=options.background || 'background_token.png';
    this.knots_img = 'knots_row.png';
    this.icon = options.icon || 'question_mark.png';
    
    if (this.icon.indexOf("../crazybioflow/img/") != -1) {
        // Backward compatibility
        this.icon = this.icon.substring(20,this.icon.length);
    }

    this.svg = options.svg ||  {type: "circle",data: {"r": 50, "cx": 50, "cy": 50, "fill": "green"} };


    this.clip=options.clip || 'undefined';
    this.clip_left=options.clip_left || 0;

    console.log('new Token '+this.ID+ ' '+this.cell_x+' '+this.cell_y+' '+this.props);
}

Token.TOKENSIZE   = 80;

Token.CLOSABLE    = 1;
Token.CONTAINABLE = 2;
Token.LINKABLE    = 4;
Token.MOVABLE     = 8;
Token.RENDERABLE  = 16;
Token.ROTATABLE   = 32;


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

    return {
        get: function (options) {;
            var tok = new Token(tokenIDs[options.type]);
            console.log(JSON.stringify(tok));
            tok.html='<div class="token" id="'+tok.ID
                    +'" style="background:'+tok.background_color
                    +';" onmousedown="move(this,event)">';

            // Background + button(s)
            if ( (tok.props & Token.CLOSABLE) && (tok.props & Token.ROTATABLE) ) {
                console.log('closable? ' + tok.props.toString(2)+ ' ' + Token.CLOSABLE + ' ' + (tok.props & Token.CLOSABLE) );
                tok.html+='<img src="'+tok.path_img+tok.background+'"'
                        +' style="position:absolute;left:0px;clip:rect(0px '+tok.height+'px '+tok.height+'px 0px);"'
                        +' onmousedown="return false;">';
            }
            else if ( (tok.props & Token.CLOSABLE) ) {
                tok.html+='<img style="';
                tok.html+='position:absolute;';
                tok.html+='left:-'+tok.height+'px;clip:rect(0px '+(2*tok.height)+'px '+tok.height+'px '+tok.height+'px);"';
                tok.html+='src="'+tok.path_img+tok.background+'" onmousedown="return false;">'
            }
            else if ( (tok.props & Token.ROTATABLE) ) {
                tok.html+='<img style="position:absolute;left:-200px;clip:rect(0px '
                        +(3*tok.height)+'px '+tok.height+'px '+(2*tok.height)+'px);" '
                        +'src="'+tok.path_img+tok.background+'" onmousedown="return false;">';
            }
            else {
                tok.html+='<img style="position:absolute;left:-300px;clip:rect(0px '
                        + (4*tok.height)+'px '+tok.height+'px '+(3*tok.height)+'px);" '
                        + 'src="'+tok.path_img+tok.background+'" onmousedown="return false;">';
            }

            // Knot(s)
            var _knots = tok.knots[0];
            for (var i=0;i<4;i++) {
                if (_knots[i] != 'x') {
                  tok.html+='<img class="knot" id="'+ _knots[i].toLowerCase() + i + '_' + tok.ID + '" src="' + tok.path_img + tok.knots_img + '" onmousedown="return false;">';
                }
            }

            // Icon
            if (tok.clip === undefined) {
                tok.html+='<img title="'+tok.title
                        +'" style="display:block; position:absolute; top:0px; left:0px;" '
                        +'src="'+tok.path_img+tok.icon+'" onmousedown="return false;">';
            }
                
            else {
               
                tok.html+='<img title="'+tok.title+'" style="display:block; position:absolute; top:0px; left:'
                        + tok.clip_left+';clip:'+tok.clip+';" src="'+tok.path_img+tok.icon+'" onmousedown="return false;">';
            }

            var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.setAttributeNS(null,'width', Game.TOKENSIZE);
            svg.setAttributeNS(null,'height', Game.TOKENSIZE);
            svg.setAttributeNS(null,'viewBox', '0 0 1000 1000');
            svg.setAttributeNS(null,'class', 'token');
            
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
            svg.appendChild(buttonNE);
           
            // Knot(s)
            var knots = document.createElementNS('http://www.w3.org/2000/svg','g');
            knots.setAttributeNS(null,'id','knots');
            knots.setAttributeNS(null,'transform','rotate(0,500,500)');
            var outN = document.createElementNS('http://www.w3.org/2000/svg','rect');
            outN.setAttributeNS(null,'x',500.0 - 165/2.0);
            outN.setAttributeNS(null,'y',9.0);
            outN.setAttributeNS(null,'width',165);
            outN.setAttributeNS(null,'height',128);
            outN.setAttributeNS(null,'fill','#FFFFFF');
            outN.setAttributeNS(null,'stroke','#000000');
            outN.setAttributeNS(null,'stroke-width',18.0);
            knots.appendChild(outN);
            var inS = document.createElementNS('http://www.w3.org/2000/svg','path');
            inS.setAttributeNS(null,'d','m 574.38196,991.65854 0,-73.98298 71.64807,-0.55974 -146.02893,-105.54043 -146.02894,105.54043 71.64741,0.55974 0,73.98298 74.38153,-1.23443 z');
            inS.setAttributeNS(null,'fill','#00ff00');
            inS.setAttributeNS(null,'stroke','#000000');
            inS.setAttributeNS(null,'stroke-width',18.0);
            inS.setAttributeNS(null,'stroke-linejoin','round');
            knots.appendChild(inS);
            var inE = document.createElementNS('http://www.w3.org/2000/svg','path');
            inE.setAttributeNS(null,'d','m 574.38196,991.65854 0,-73.98298 71.64807,-0.55974 -146.02893,-105.54043 -146.02894,105.54043 71.64741,0.55974 0,73.98298 74.38153,-1.23443 z');
            inE.setAttributeNS(null,'transform','rotate(90,500,500)');
            inE.setAttributeNS(null,'fill','#00ff00');
            inE.setAttributeNS(null,'stroke','#000000');
            inE.setAttributeNS(null,'stroke-width',18.0);
            inE.setAttributeNS(null,'stroke-linejoin','round');
            knots.appendChild(inE);
            var inW = document.createElementNS('http://www.w3.org/2000/svg','path');
            inW.setAttributeNS(null,'d','m 574.38196,991.65854 0,-73.98298 71.64807,-0.55974 -146.02893,-105.54043 -146.02894,105.54043 71.64741,0.55974 0,73.98298 74.38153,-1.23443 z');
            inW.setAttributeNS(null,'transform','rotate(-90,500,500)');
            inW.setAttributeNS(null,'fill','#00ff00');
            inW.setAttributeNS(null,'stroke','#000000');
            inW.setAttributeNS(null,'stroke-width',18.0);
            inW.setAttributeNS(null,'stroke-linejoin','round');
            knots.appendChild(inW);
            
            svg.appendChild(knots);
           
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
            
                
            tok.html=svg;
            return tok;
        }
    }

})();

var tokenIDs = {
    'calcNumber'   : {
        "ID"    : "CALC_TOK",
        "name"   :"calcNumber",
        "comment": "Container of arithmetic Functions",
        "props"  : Token.CLOSABLE | Token.CONTAINABLE | Token.LINKABLE | Token.MOVABLE | Token.SWITCHABLE | Token.RENDERABLE | Token.ROTATABLE,
        "knots"  : ["xoxi"],
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
        "name"   :"calcString",
        "comment": "Container of String Functions",
        "props"  : ["CLOSABLE" , "LINKABLE" , "MOVABLE" , "CONTAINABLE" , "RENDERABLE" , "ROTATABLE"],
        "knots"  : ["xoxi"],
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
            "type": "circle",
            "data": {"r": 200, "cx": 500, "cy": 500, "fill": "green"}
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
            "type": "circle",
            "data": {"r": 200, "cx": 500, "cy": 500, "fill": "green"}
        },
    },
    'filter'       :  {
        "ID"     : "FILT_TOK",
        "name"   : "filter",
        "comment": "Filter Function",
        "props"  : Token.CLOSABLE | Token.CONTAINABLE | Token.LINKABLE | Token.MOVABLE | Token.RENDERABLE | Token.ROTATABLE,
        "knots"  : ["xooi","ooxi"],
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
        "knots"  : ["xooi","ooxi"],
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
        "knots"  : ["xoxi","xixo","oixx","ioxx"],
        "title"  : "Function f(x)",
        "svg"    : {
            "type": "circle",
            "data": {"r": 200, "cx": 500, "cy": 500, "fill": "green"}
        },
    },
    'hub'          :  {
         "ID"    : "HUB__TOK",
        "name"   : "function",
        "comment": "Function f(x)",
        "props"  : Token.CLOSABLE | Token.CONTAINABLE | Token.LINKABLE | Token.MOVABLE | Token.RENDERABLE | Token.ROTATABLE,
        "knots"  : ["xoxi","xixo","oixx","ioxx"],
        "title"  : "Function f(x)",
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
        "knots"  : ["xooi","ooxi"],
        "title"  : "IF (condition) THEN return true ELSE return false",
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
                "9.70321,-22.45541 9.70321,-19.40591 25.50528,-48.37624 15.80145,-28.97034 29.66327,-54.19805 13.86118,-25.22764 28.27664,-51.00988 14.41608,-25.78217 15.52526,-27.72274 4.99033,-9.1485 15.52462,-9.1485 10.53494,0 15.52463,9.1485 1.10918,1.94057 15.52526,27.72274 14.41546,25.78224 28.27664,51.00988 13.86119,25.22771 29.6639,54.19805 15.80144,28.97033 25.50465,48.37624 9.70258,19.40591 9.70258,22.45541 z m -354.85126,0 q 0,20.23763 -12.89105,36.31684 -12.89042,16.07922 -32.57429,25.22771 -19.6826,9.14856 -40.05915,13.72278 -20.37655,4.57428 -38.67316,4.57428 -18.29725,0 -38.6738,-4.57428 -20.37528,-4.57422 -40.05915,-13.72278 -19.6826,-9.14849 -32.57429,-25.22771 -12.89105,-16.07921 -12.89105,-36.31684 0,-3.0495 9.70257,-22.45541 9.70321,-19.40591 25.50529,-48.37624 15.80208,-28.97034 29.66327,-54.19805 13.86182,-25.22764 28.2779,-51.00988 14.41546,-25.78217 15.524,-27.72274 4.98969,-9.1485 15.52526,-9.1485 10.53493,0 15.52463,9.1485 1.10917,1.94057 15.52462,27.72274 14.41546,25.78224 28.27728,51.00988 13.86118,25.22771 29.66326,54.19805 15.80208,28.97033 25.50529,48.37624 9.70257,19.40591 9.70257,22.45541 z"
            }
        },
    },
    'input_ro'     :  {
         "ID"    : "INRO_TOK",
        "name"   : "input_ro",
        "comment": "Input Read Only",
        "props"  : Token.CLOSABLE | Token.CONTAINABLE | Token.LINKABLE | Token.MOVABLE | Token.RENDERABLE | Token.ROTATABLE,
        "knots"  : ["xoxx"],
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
    'input_rw'     :  {
         "ID"    : "INRW_TOK",
        "name"   : "input_rw",
        "comment": "Input Read/Write",
        "props"  : Token.CLOSABLE | Token.CONTAINABLE | Token.LINKABLE | Token.MOVABLE | Token.RENDERABLE | Token.ROTATABLE,
        "knots"  : ["xoxx"],
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
    'input_cloud'  :  {
         "ID"    : "CLUD_TOK",
        "name"   : "function",
        "comment": "Function f(x)",
        "props"  : Token.CLOSABLE | Token.CONTAINABLE | Token.LINKABLE | Token.MOVABLE | Token.RENDERABLE | Token.ROTATABLE,
        "knots"  : ["xoxi","xixo","oixx","ioxx"],
        "title"  : "Function f(x)",
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
    'input_new'    : {
         "ID"    : "INEW_TOK",
        "name"   : "function",
        "comment": "Function f(x)",
        "props"  : Token.CLOSABLE | Token.CONTAINABLE | Token.LINKABLE | Token.MOVABLE | Token.RENDERABLE | Token.ROTATABLE,
        "knots"  : ["xoxi","xixo","oixx","ioxx"],
        "title"  : "Function f(x)",
        "svg"    : {
            "type": "circle",
            "data": {"r": 200, "cx": 500, "cy": 500, "fill": "green"}
        },
    },
    'map'          : {
         "ID"    : "MAP__TOK",
        "name"   : "map",
        "comment": "Map Function",
        "props"  : Token.CLOSABLE | Token.CONTAINABLE | Token.LINKABLE | Token.MOVABLE | Token.SWITCHABLE | Token.RENDERABLE | Token.ROTATABLE,
        "knots"  : ["xooi","ooxi"],
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
                "d": "m 792.14871,269.92516 q 8.04615,5.74725 8.04615,15.23021 v 404.60782 q 0,5.74725 -3.16092,10.34511 -3.16091,4.59771 -8.3332,6.60935 l -183.91326,73.56503 q -6.8966,3.16099 -13.79321,0 L 413.97829,709.59124 236.96231,780.28268 q -2.87385,1.43679 -6.8966,1.43679 -5.46001,0 -10.34524,-3.16104 -8.04615,-5.74726 -8.04615,-15.2302 V 358.7204 q 0,-5.74726 3.16092,-10.34504 3.16091,-4.59779 8.33386,-6.60936 l 183.91259,-73.56509 q 6.8966,-3.16092 13.79321,0 l 177.01598,70.6915 177.01598,-70.6915 q 9.19569,-3.73569 17.24185,1.72425 z m -368.97472,38.79402 v 364.95164 l 165.5212,66.09358 V 374.81277 z m -174.7169,62.3579 V 736.02865 L 404.7826,673.67082 V 308.71918 z M 763.41273,677.40657 V 312.45493 L 607.08658,374.81277 V 739.7644 z"
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
        "knots"  : ["xoxx"],
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
        "knots"  : ["xoxi","xixo","oixx","ioxx"],
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
        "knots"  : ["xxix"],
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
        "knots"  : ["xxix"],
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



