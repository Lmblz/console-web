namespace ConsoleMatycom.Models.Hellobars
{
    public class HelloBarPublicationVM
    {
        /// <summary>
        /// La date de publication d'une HelloBar
        /// </summary>
        public DateTime datePublish { get; set; }

        /// <summary>
        /// La date de suppression d'une HelloBar
        /// </summary>
        public DateTime dateDelete { get; set; }

        public HelloBarPublicationVM()
        {
        }
    }
}
