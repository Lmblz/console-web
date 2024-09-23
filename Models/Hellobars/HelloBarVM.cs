namespace ConsoleMatycom.Models.Hellobars
{
    public class HelloBarVM
    {
        public int id { get; set; }
        public string title { get; set; }
        public string content { get; set; }
        public string background { get; set; }
        public string color { get; set; }
        public string closeColor { get; set; }
        public string dateCount { get; set; }
        public string support{ get; set; }
        public HelloBarPublicationVM publication { get; set; }
        public DateTime lastModifiedDate { get; set; }

        public HelloBarVM()
        {
        }
    }
}
