using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ConsoleMatycom.Models.Elements
{
    public class ButtonVM
    {
        public string Text { get; set; }
        public string Url { get; set; }

        public string EncodedUrl { get; set; }

        public string Class { get; set; } = "button -black -bgtransparent -big";

        public ButtonVM() 
        {
            Text = String.Empty;
            Url = String.Empty;
            EncodedUrl = String.Empty;
        }
    }
}