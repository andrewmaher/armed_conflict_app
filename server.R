library(shiny)
library(plyr)

edges <- read.csv('./data/edge_list.csv', stringsAsFactor = FALSE)

shinyServer(function(input, output) {

  data <- reactive(function() {
    
    sub.edges <- edges[which(edges[,'year']==input$year),c('source','target')]
    colnames(sub.edges) <- c('source_displayname','target_displayname')
    allnodes <- sort(unique(c(sub.edges[,'source_displayname'],sub.edges[,'target_displayname'])))
    nodes <- data.frame(source_displayname=allnodes,
      source=0:(length(allnodes)-1),stringsAsFactors=F)
    sub.edges <- join(sub.edges,nodes,by='source_displayname')
    colnames(nodes) <- c('target_displayname','target')
    sub.edges <- join(sub.edges,nodes,by='target_displayname')
    sub.edges <- sub.edges[,c('source','target')]
    sub.edges[,'value'] <- 1
    
    list(names=nodes[,'target_displayname'], links=as.matrix(sub.edges))
  
  })
  
  output$chart <- reactive(function() { data() })
  
})