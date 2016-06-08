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
    get: function (options) {
      var tok = new Token(options);
      console.log(tok.description.title +' '+tok.width);
      tok.html='<div class="token" id="'+tok.ID+'" style="background:'+tok.background_color+';" onmousedown="move(this,event)">';

      // Background + button(s)
      if ( (tok.props & CLOSABLE) && (tok.props & ROTATABLE) ) {
        console.log('closable? ' + tok.props.toString(2)+ ' ' + CLOSABLE + ' ' + (tok.props & CLOSABLE) );
        tok.html+='<img src="'+tok.path_img+tok.background+'" style="position:absolute;left:0px;clip:rect(0px '+tok.height+'px '+tok.height+'px 0px);"  onmousedown="return false;">';
      }
      else if ( (tok.props & CLOSABLE) ) {
        tok.html+='<img style="';
        tok.html+='position:absolute;';
        tok.html+='left:-'+tok.height+'px;clip:rect(0px '+(2*tok.height)+'px '+tok.height+'px '+tok.height+'px);"';
        tok.html+='src="'+tok.path_img+tok.background+'" onmousedown="return false;">'
      }
      else if ( (tok.props & ROTATABLE) ) {
        tok.html+='<img style="position:absolute;left:-200px;clip:rect(0px '+(3*tok.height)+'px '+tok.height+'px '+(2*tok.height)+'px);" src="'+tok.path_img+tok.background+'" onmousedown="return false;">';
      }
      else {
        tok.html+='<img style="position:absolute;left:-300px;clip:rect(0px '+(4*tok.height)+'px '+tok.height+'px '+(3*tok.height)+'px);" src="'+tok.path_img+tok.background+'" onmousedown="return false;">';
      }

      // Knot(s)
      for (var i=0;i<4;i++) {
        if (tok.knots[i]!= 'x') {
          tok.html+='<img class="knot" id="'+tok.knots[i].toLowerCase()+i+'_'+tok.ID+'" src="'+tok.path_img+tok.knots_img+'" onmousedown="return false;">';
        }
      }

      // Icon
      if (tok.clip=='undefined')
        tok.html+='<img title="'+tok.title+'" style="display:block; position:absolute; top:0px; left:0px;" src="'+tok.path_img+tok.icon+'" onmousedown="return false;">';
      else
        tok.html+='<img title="'+tok.title+'" style="display:block; position:absolute; top:0px; left:'+tok.clip_left+';clip:'+tok.clip+';" src="'+tok.path_img+tok.icon+'" onmousedown="return false;">';

      tok.html+='</div';
      return tok;
    }
  }

})();
