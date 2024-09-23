using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ConsoleMatycom.Models.Elements
{
    public class TitleVM
    {
        public string Text { get; set; }
        public string Url { get; set; }
        public bool HasShadow { get; set; }

        public TitleVM()
        {
            Text = string.Empty;
            Url = string.Empty;
            HasShadow = false;
        }
    }
}