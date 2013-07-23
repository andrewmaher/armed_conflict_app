library(shiny)

reactiveNetwork <- function (outputId) 
{
  HTML(paste("<div id=\"", outputId, "\" class=\"shiny-network-output\"><svg /></div>", sep=""))
}

shinyUI(pageWithSidebar(
  
  headerPanel("History of Armed Conflict (1946-2012)"),
  sidebarPanel(

    sliderInput("year", "Year:",format="####.",
                min = 1946, max = 2012, value = 1946,step=1)
        
  ),
  
  mainPanel(
    includeHTML("graph.js"),
    reactiveNetwork(outputId = "chart")
  )
))

