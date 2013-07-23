library(shiny)

edges <- read.csv('./data/edge_list.csv', stringsAsFactor = FALSE)

shinyServer(function(input, output) {

  data <- reactive(function() {

    sub.edges <- edges[which(edges[,'year']==input$year),c('source','target','type','distance')]
    
    list(links=as.matrix(sub.edges))
  
  })
  
  output$chart <- reactive(function() { data() })
  
})