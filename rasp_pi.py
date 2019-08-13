#!/usr/bin/env python
# Display a runtext with double-buffering.
from samplebase import SampleBase
from rgbmatrix import graphics
import time
import threading
from pymongo import MongoClient
client = MongoClient('mongodb://35.247.88.248:27017');


message_list = []

def get_data():
    threading.Timer(5.0, get_data).start()
    message_list.clear()
    db = client.messagedata
    messages = db.messages
    all_messages = messages.find()

    for x in all_messages:
        x = (x["name"])
        single_message = (x["message"])
        message_list.append(single_message);


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

        for i in message_list:
            print(i)
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

