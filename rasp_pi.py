#!/usr/bin/env python
# Display a runtext with double-buffering.
from samplebase import SampleBase
from rgbmatrix import graphics
import time
import itertools
import threading
from pymongo import MongoClient
client = MongoClient('mongodb://35.247.88.248:27017');


message_list = []
color_list = []

def get_data():
    threading.Timer(5.0, get_data).start()
    message_list.clear()
    color_list.clear()
    db = client.messagedata
    messages = db.messages
    all_messages = messages.find()
    
    for x in all_messages:
        x = (x["name"])
        single_message = (x["message"])
        color = (x["color"])
        message_list.append(single_message);
        color_list.append(color);


class RunText(SampleBase):
    def __init__(self, *args, **kwargs):
        super(RunText, self).__init__(*args, **kwargs)
        self.parser.add_argument("-t", "--text", help="The text to scroll on the RGB LED panel", default="Hello World")

    def run(self):
        get_data() 
        offscreen_canvas = self.matrix.CreateFrameCanvas()
        font = graphics.Font()
        font.LoadFont("../../../fonts/7x13.bdf")
        textColor = graphics.Color(3,102,252)
        pos = offscreen_canvas.width
        my_text = self.args.text

        runner = True

        while runner:
            for (i,j) in zip(message_list,color_list):
                color = j
                print(color)
                if color == 'rgb(240, 125, 125)':
                    textColor = graphics.Color(240,125,125)
                elif color == 'rgb(125, 192, 240)':
                    textColor = graphics.Color(125,192,240)
                elif color == 'rgb(240, 221, 125)':
                    textColor = graphics.Color(240,221,125)
                elif color == 'rgb(125, 240, 144)':
                    textColor = graphics.Color(125,240,144)
                elif color == 'rgb(198, 125, 240)':
                    textColor = graphics.Color(198,125,240)
                elif color == 'rgb(240, 125, 161)':
                    textColor = graphics.Color(240,125,161)
                elif color == 'rgb(255, 255, 255)':
                    textColor = graphics.Color(255, 255, 255)
                while runner:
                    offscreen_canvas.Clear()
                    len = graphics.DrawText(offscreen_canvas, font, pos, 20, textColor, i)
                    pos -= 1
                    if (pos + len < 0):
                        pos = offscreen_canvas.width
                        runner = False 

                    time.sleep(0.05)
                    offscreen_canvas = self.matrix.SwapOnVSync(offscreen_canvas)
                runner = True


# Main function
if __name__ == "__main__":
    run_text = RunText()
    if (not run_text.process()):
        run_text.print_help()

