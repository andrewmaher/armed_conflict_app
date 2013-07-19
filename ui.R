library(shiny)

reactiveNetwork <- function (outputId) 
{
  HTML(paste("<div id=\"", outputId, "\" class=\"shiny-network-output\"><svg /></div>", sep=""))
}

shinyUI(pageWithSidebar(
  
  headerPanel("Armed Conflict"),
  sidebarPanel(

    sliderInput("year", "Year:",format="####.",
                min = 1946, max = 2012, value = 1946,step=1)
        
  ),
  
  mainPanel(
    includeHTML("graph.js"),
    reactiveNetwork(outputId = "chart")
  )
))

