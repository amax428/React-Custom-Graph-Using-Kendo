import { Image, Surface, Path, Text, Circle, Group } from '@progress/kendo-drawing';
import { Rect, Point, Size, transform, Circle as GeomCircle } from '@progress/kendo-drawing/geometry';

var backFontColor = '#ffffff';
var dataColor = '#44bb74';
var classColor = '#fdcb6e';
var graphBackColor = '#555555';
var patternColor = '#404040';
var fontFamily = 'Arial';
var titleFontSize = 30;
var commentFontSize = 15;
var cateTextFontSize = 15;
var bubbleTextFontSize = 15;
var makeupIndex = 2;

export function drawScene(surface, width, height) {

    const data = [
            {category: 'PT 1', Value: 70},
            {category: 'PT 2', Value: 67},
            {category: 'PT 3', Value: 86},
            {category: 'PT 4', Value: 104},
            {category: 'PT 5', Value: 124},
            {category: 'PT 6', Value: 129},
            {category: 'PT 7', Value: 0},
            {category: 'PT 8', Value: 0},
            {category: 'PT 9', Value: 0},
            {category: 'PT 10', Value: 0},
            {category: 'PT 11', Value: 0}
        ];
    
    const classData = [
        {category: 'PT 1', Value: 48},
        {category: 'PT 2', Value: 54},
        {category: 'PT 3', Value: 74},
        {category: 'PT 4', Value: 117},
        {category: 'PT 5', Value: 133},
        {category: 'PT 6', Value: 108},
        {category: 'PT 7', Value: 0},
        {category: 'PT 8', Value: 0},
        {category: 'PT 9', Value: 0},
        {category: 'PT 10', Value: 0},
        {category: 'PT 11', Value: 0}
    ];

    var graph_height = height * 0.6;
    
    var divCnt = data.length;
    var d_width = width / divCnt;
    var maxVal1 = getMaxValue(data);
    var maxVal2 = getMaxValue(classData);
    var maxVal = (maxVal1 > maxVal2) ? maxVal1 : maxVal2;
    var h_ratio = graph_height / maxVal * 0.9;



    const group = new Group();

    var x_prev_btm, y_prev_btm, x_prev_top, y_prev_top;
    var x_c_prev_btm, y_c_prev_btm, x_c_prev_top, y_c_prev_top;

    var nLiveDataCnt = 0;

    for (var i = 0; i < divCnt; i++ ) {
        if (data[i].Value <= 0) {
          break;
        }
    }

    nLiveDataCnt = i;

    //drawing graph
    for (i = 0; i < divCnt; i++ ) {
        
        //drawing dashed grid
        const path_grid = new Path({
            stroke: {
                color: graphBackColor,
                width: 1,
                dashType: 'dash'
            }
        });

        var x = d_width * (i + 0.5);
        var y1 = height - 0;
        var y2 = titleFontSize * 3;
        
        path_grid.moveTo(x, y1).lineTo(x, y2);
        group.append(path_grid);

        //ignore dataes without value
        if (i >= nLiveDataCnt) {
          continue;
        }
        
        if (i == 0) {
            x_prev_btm = x;
            x_prev_top = x;
            y_prev_btm = y1;
            y_prev_top = height - data[i].Value * h_ratio;
            x_c_prev_btm = x;
            x_c_prev_top = x;
            y_c_prev_btm = y1;
            y_c_prev_top = height - classData[i].Value * h_ratio;
            continue;
        }

        var x_btm, y_btm, x_top, y_top;
        var x_c_btm, y_c_btm, x_c_top, y_c_top;

        //drawing data
        x_c_btm = x;
        x_c_top = x;
        y_c_btm = y1;
        y_c_top = height - classData[i].Value * h_ratio;   

        const path_class_graph = new Path({
            stroke: {
                color: classColor,
                width: 0
            },
            fill: {
                color: classColor,
                opacity: 0.2
            }
        });        
        
        path_class_graph.moveTo(x_c_prev_btm, y_c_prev_btm).lineTo(x_c_prev_top, y_c_prev_top).lineTo(x_c_top, y_c_top).lineTo(x_c_btm, y_c_btm).close();
        
        x_btm = x;
        x_top = x;
        y_btm = y1;
        y_top = height - data[i].Value * h_ratio;

        const path_my_graph = new Path({
            stroke: {
                color: dataColor,
                width: 0
            },
            fill: {
                color: dataColor,
                opacity: 0.5
            }
        });        
        
        path_my_graph.moveTo(x_prev_btm, y_prev_btm).lineTo(x_prev_top, y_prev_top).lineTo(x_top, y_top).lineTo(x_btm, y_btm).close();
        group.append(path_my_graph);

        //drawing pattern
        if (i == nLiveDataCnt - 1) {
            const pCounts = 8;
            var maxHeight = maxVal * h_ratio;
            var dPtrnW = d_width / pCounts;

            var pY = height;
            var pX = x_prev_btm;
            var pX0 = pX;
            var pY0 = pY;

            var lineWidth = 3;
            while (pY >= 0) {
                pY -= dPtrnW;
                pX += dPtrnW;

                const path_my_ptrnLine = new Path({
                    stroke: {
                        color: patternColor,
                        width: 3
                    }
                });        
                
                path_my_ptrnLine.moveTo(pX0, pY).lineTo(pX, pY0).close();
                group.append(path_my_ptrnLine);
            }
        }

        group.append(path_class_graph);

        //drawing stroke
        const path_class_graph_stroke = new Path({
            stroke: {
                color: classColor,
                width: 3
            }
        });

        path_class_graph_stroke.moveTo(x_c_prev_top, y_c_prev_top).lineTo(x_c_top, y_c_top).close();
        group.append(path_class_graph_stroke);

        const path_my_graph_stroke = new Path({
            stroke: {
                color: dataColor,
                width: 3
            }
        });

        path_my_graph_stroke.moveTo(x_prev_top, y_prev_top).lineTo(x_top, y_top).close();
        group.append(path_my_graph_stroke);

        //reseting original points
        x_prev_btm = x_btm;
        x_prev_top = x_top;
        y_prev_btm = y_btm;
        y_prev_top = y_top;
        x_c_prev_btm = x_c_btm;
        x_c_prev_top = x_c_top;
        y_c_prev_btm = y_c_btm;
        y_c_prev_top = y_c_top;
    }

    for (i = 0; i < divCnt; i++) {

        var x = d_width * (i + 0.5);
        var cateText = data[i].category;
        var cateTextWidth = measureText(cateText, cateTextFontSize);
        var cateFont = 'bold ' + cateTextFontSize.toString() + 'px ' + fontFamily;
        
        const text = new Text(
            data[i].category,
            new Point(x - cateTextWidth / 2, height - cateTextFontSize * 1.5),
            { font: cateFont, fill: {color: backFontColor}}
        );
        group.append(text);

        if (i >= nLiveDataCnt) {
            continue;
        }
                
        var geometry = new GeomCircle([ x, height - classData[i].Value * h_ratio ], 7);
        var circle = new Circle(geometry, {
            stroke: { color: classColor, width: 0 },
            fill: {color: classColor}
        });
        group.append(circle);

        geometry = new GeomCircle([ x, height - data[i].Value * h_ratio ], 7);
        circle = new Circle(geometry, {
            stroke: { color: dataColor, width: 0 },
            fill: {color: dataColor}
        });
        group.append(circle);

        //make up text
        if (i == makeupIndex) {
            var dataBGroup = createBubbleRect(new Point(x, height - 15 * 3), 'Makeup', '', 0);
            group.append(dataBGroup);
        }

        if (i >= nLiveDataCnt - 2 ) {
            geometry = new GeomCircle([ x, height - classData[i].Value * h_ratio ], 3);
            circle = new Circle(geometry, {
                stroke: { color: backFontColor, width: 0 },
                fill: {color: backFontColor}
            });
            group.append(circle);

            geometry = new GeomCircle([ x, height - data[i].Value * h_ratio ], 3);
            circle = new Circle(geometry, {
                stroke: { color: backFontColor, width: 0 },
                fill: {color: backFontColor}
            });
            group.append(circle);

            //drawing bubble rect
            var upword = 2;
            
            if (data[i].Value > classData[i].Value) upword = 1;

            var dataBGroup = createBubbleRect(new Point(x, height - data[i].Value * h_ratio), data[i].Value.toString(), 'data', upword);
            group.append(dataBGroup);
            var clasBGroup = createBubbleRect(new Point(x, height - classData[i].Value * h_ratio), classData[i].Value.toString(), 'class', 3 - upword);
            group.append(clasBGroup);
        }
    }

    //drawing Title Text and comments
    var titleFont = 'bold ' + titleFontSize.toString() + 'px ' + fontFamily;
    var titleTextOption = { font: titleFont, fill: {color: backFontColor}};

    const titleText = new Text(
        'SCORE SNAPSHOT',
        new Point(d_width * 0.5, titleFontSize),
        titleTextOption
    );
    group.append(titleText);

    var commentFont = commentFontSize.toString() + 'px ' + fontFamily;
    var commentTextOption = { font: commentFont, fill: {color: backFontColor}};

    var commentClassTextWidth = measureText("Class", commentFontSize);
    var commentDataTextWidth = measureText("Me", commentFontSize);

    var xStart = width - d_width * 0.5 - commentClassTextWidth;
    var yStart = titleFontSize * 2 - commentFontSize;
    var commentText = new Text(
        'Class',
        new Point(xStart, yStart),
        commentTextOption
    );

    group.append(commentText);

    xStart -= commentFontSize;
    
    var commentDataGeom = new GeomCircle([xStart, yStart + commentFontSize / 2], commentFontSize / 2);
    var commentCircle = new Circle(commentDataGeom, {
        stroke: { color: classColor, width: 0 },
        fill: {color: classColor}
    });

    group.append(commentCircle);

    xStart -= commentFontSize * 2 + commentDataTextWidth;

    commentText = new Text(
        'Me',
        new Point(xStart, yStart),
        commentTextOption
    );

    group.append(commentText);

    xStart -= commentFontSize;

    commentDataGeom = new GeomCircle([xStart, yStart + commentFontSize / 2], commentFontSize / 2);
    commentCircle = new Circle(commentDataGeom, {
        stroke: { color: dataColor, width: 0 },
        fill: {color: dataColor}
    });

    group.append(commentCircle);
    // Render the group on the surface
    surface.draw(group);

    //return BasicSvg;

}

function getMaxValue(dataArray) {
  var rlt = 0;
  var size = dataArray.length;
  
  for (var i = 0; i < size; i++ ) {
      var val = dataArray[i].Value;
      if (rlt < val) {
        rlt = val;
      }
  }
  return rlt;
}

function createBubbleRect(point, text, isData, upword) {

    var fontSize = bubbleTextFontSize;
    var textWidth = measureText(text, fontSize);
    var size = new Point(0, 0);

    size.x = textWidth * 1.5;
    size.y = fontSize * 1.5;

    const group = new Group();
    var pt = point;
    if (upword == 1) {
        pt.y -= size.y * 1.5;
    }
    else if (upword == 2){
        pt.y += size.y * 1.5;
    }

    var fillOption = {
        stroke: {
            color: backFontColor,
            width: 1
        }
    };
    if (isData == 'data') {
        fillOption = {
            stroke: {
                color: dataColor,
                width: 0
            },
            fill: {
                color: dataColor
            }
        }
    }
    else if (isData == 'class') {
        fillOption = {
            stroke: {
                color: classColor,
                width: 0
            },
            fill: {
                color: classColor
            }
        }
    }

    var roundedRectPath = new Path(fillOption);
    var curveDistanceX = size.x / 5;
    var curveDistanceY = size.y / 5;
    var x = point.x - size.x / 2;
    var y = point.y - size.y / 2;
    
    var bottomRightX = x + size.x;
    var bottomRightY = y + size.y;

    var dTri = curveDistanceX / 2;
    roundedRectPath.moveTo(bottomRightX - curveDistanceX, y)
    .curveTo([bottomRightX, y], [bottomRightX, y], [bottomRightX, y + curveDistanceY])
    .lineTo([bottomRightX, bottomRightY - curveDistanceY])
    .curveTo([bottomRightX, bottomRightY], [bottomRightX, bottomRightY], [bottomRightX - curveDistanceX, bottomRightY]);

    if (upword == 1) {
        roundedRectPath.lineTo([point.x + dTri, bottomRightY])
        .lineTo([point.x, bottomRightY + dTri * 2])
        .lineTo([point.x - dTri, bottomRightY]);
    }
    roundedRectPath.lineTo([x + curveDistanceX, bottomRightY])
    .curveTo([x, bottomRightY], [x, bottomRightY], [x, bottomRightY - curveDistanceY])
    .lineTo(x, y + curveDistanceY)
    .curveTo([x, y], [x, y], [x + curveDistanceX, y]);
    if (upword == 2) {
        roundedRectPath.lineTo([point.x - dTri, y])
        .lineTo([point.x, y - dTri * 2])
        .lineTo([point.x + dTri, y]);
    }
    roundedRectPath.close();

    group.append(roundedRectPath);

    var hereTextFont = 'bold ' + fontSize.toString() + 'px ' + fontFamily;
    const txt = new Text(
        text,
        new Point(point.x - textWidth / 2, point.y - fontSize / 2 * 1.2),
        { font: hereTextFont, fill: {color: backFontColor}}
    );

    group.append(txt);
    return group;
}

function measureText(str, fontSize = 10) {
  const widths = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.2796875,0.2765625,0.3546875,0.5546875,0.5546875,0.8890625,0.665625,0.190625,0.3328125,0.3328125,0.3890625,0.5828125,0.2765625,0.3328125,0.2765625,0.3015625,0.5546875,0.5546875,0.5546875,0.5546875,0.5546875,0.5546875,0.5546875,0.5546875,0.5546875,0.5546875,0.2765625,0.2765625,0.584375,0.5828125,0.584375,0.5546875,1.0140625,0.665625,0.665625,0.721875,0.721875,0.665625,0.609375,0.7765625,0.721875,0.2765625,0.5,0.665625,0.5546875,0.8328125,0.721875,0.7765625,0.665625,0.7765625,0.721875,0.665625,0.609375,0.721875,0.665625,0.94375,0.665625,0.665625,0.609375,0.2765625,0.3546875,0.2765625,0.4765625,0.5546875,0.3328125,0.5546875,0.5546875,0.5,0.5546875,0.5546875,0.2765625,0.5546875,0.5546875,0.221875,0.240625,0.5,0.221875,0.8328125,0.5546875,0.5546875,0.5546875,0.5546875,0.3328125,0.5,0.2765625,0.5546875,0.5,0.721875,0.5,0.5,0.5,0.3546875,0.259375,0.353125,0.5890625]
  const avg = 0.5279276315789471
  return str
    .split('')
    .map(c => c.charCodeAt(0) < widths.length ? widths[c.charCodeAt(0)] : avg)
    .reduce((cur, acc) => acc + cur) * fontSize;
}