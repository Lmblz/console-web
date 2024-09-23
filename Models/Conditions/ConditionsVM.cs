namespace ConsoleMatycom.Models.Conditions
{
    public class ConditionsVM
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string TableOfContent { get; set; }
        public string Content { get; set; }
        public DateTime DatePublish { get; set; }
        public string DatePublishFormated
        {
            get
            {
                return DatePublish.ToString("dd/MM/yyyy - HH:mm");
            }
        }
        public DateTime LastModified { get; set; }
        public string LastModifiedFormated
        {
            get
            {
                return LastModified.ToString("dd/MM/yyyy - HH:mm");
            }
        }
        public DateTime DateDelete { get; set; }

        public string DateDeleteFormated
        {
            get
            {
                return DateDelete.ToString("dd/MM/yyyy - HH:mm");
            }
        }
        public ConditionsVM() { }
    }
}
