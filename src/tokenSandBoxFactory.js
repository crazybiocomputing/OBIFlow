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
