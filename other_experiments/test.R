library(shiny)
library(shinydashboard)

ui <- dashboardPage(
  dashboardHeader(title = "Basic dashboard"),
  dashboardSidebar(),
  dashboardBody(
    # Boxes need to be put in a row (or column)
    fluidRow(
      box(plotOutput("plot1", height = 250)),

      box(
        title = "Controls",
        sliderInput("slider", "Number of observations:", 1, 100, 50)
      )
    )
  )
)

server <- function(input, output) {
  set.seed(122)

  library(readxl)



Bachelor_Data_Retention_Graduation <- read_excel("./data/Bachelor-Data-Retention-Graduation.xlsx",
                                                 sheet = "Retention-Rate model1", na = "\"\"",
                                                 skip = 1, )



research_uni <- Bachelor_Data_Retention_Graduation[Bachelor_Data_Retention_Graduation[2]== "(RU)",]

some_data <- as.data.frame(sapply(research_uni[-1][2], as.numeric))

r <- research_uni[1]
  histdata <- rnorm(500)

  output$plot1 <- renderPlot({
    data <- some_data$`2010/11`[seq_len(input$slider)]
    names <- r$COUNTRY[seq_len(input$slider)]
    hist(data)
  })
}

shinyApp(ui, server)
