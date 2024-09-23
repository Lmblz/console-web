using ConsoleMatycom.Models.Components.Sections.Images;

namespace ConsoleMatycom.Models.Elements
{
    public class ImageVM
    {
        /// <summary>
        /// Encoded Url
        /// </summary>
        public string Url { get; set; }
        
        /// <summary>
        /// Responsive Picture
        /// </summary>
        public ResponsivePictureVM Picture { get; set; }

        public ImageVM() { }
    }
}