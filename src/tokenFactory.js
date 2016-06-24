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
            inS.setAttributeNS(null,'fill','#ffffff');
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
