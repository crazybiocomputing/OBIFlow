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
                    var angle = 90*i;
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
                    var angle = (90*i + 180)%360; // HACK
                    tmp.setAttributeNS(null,'transform','rotate('+angle+',500,500)');
                    tmp.setAttributeNS(null,'x',500.0 - 165/2.0);
                    tmp.setAttributeNS(null,'y',9.0);
                    tmp.setAttributeNS(null,'width',165);
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
            
            /* Obsolete
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

            */
            
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
                    arr[0] = (parseInt(arr[0])+90)%360;
                    knots_layer.setAttributeNS(null,'transform','rotate('+arr.join(',')+')');
                });
            svg.appendChild(buttonNE);
            
            // Knot(s)
            svg.appendChild(createKnots(tok.knots[0]) );
           
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
