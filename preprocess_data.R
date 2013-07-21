library(plyr)

# Read in UCDP/PRIO Armed Conflict Dataset CSV
fname <- './data/ucdp.prio.armed.conflict.v4.2013.csv'
df <- read.csv(fname,stringsAsFactors=F)

# Keep only the columns we need
df <- df[,c('ID','SideA','SideA2nd','SideB','SideB2nd','YEAR','Type')]
df[,'ID'] <- paste('Conflict',df[,'ID'])

separate_comma_string <- function(x){
  if(x!=''){
    return(gsub(" $","",strsplit(x,', ')[[1]], perl=T))
  }else{
    return(x)
  }
}

# Expand data.frame
df.exp <- ddply(df,c('ID','YEAR'),summarize,SideA = separate_comma_string(SideA))
df.exp <- join(df.exp,ddply(df,c('ID','YEAR'),summarize,
  SideA2nd = separate_comma_string(SideA2nd)),by=c('ID','YEAR'))
df.exp <- join(df.exp,ddply(df,c('ID','YEAR'),summarize,
  SideB = separate_comma_string(SideB)),by=c('ID','YEAR'))
df.exp <- join(df.exp,ddply(df,c('ID','YEAR'),summarize,
  SideB2nd = separate_comma_string(SideB2nd)),by=c('ID','YEAR'))

# Create edge list
# Supportive edges
ind <- intersect(which(df.exp[,'SideA']!=''),which(df.exp[,'SideA2nd']!=''))
edges <- data.frame(year=df.exp[ind,'YEAR'],
  source=df.exp[ind,'SideA2nd'],
  target=df.exp[ind,'SideA'],
  type=rep('supportive',length(ind)),
  stringsAsFactors=F)
ind <- intersect(which(df.exp[,'SideB']!=''),which(df.exp[,'SideB2nd']!=''))
edges <- rbind(edges,data.frame(year=df.exp[ind,'YEAR'],
  source=df.exp[ind,'SideB2nd'],
  target=df.exp[ind,'SideB'],
  type=rep('supportive',length(ind)),
  stringsAsFactors=F))
# Opposing edges
ind <- intersect(which(df.exp[,'SideA']!=''),which(df.exp[,'SideB']!=''))
edges <- rbind(edges,data.frame(year=df.exp[ind,'YEAR'],
  source=df.exp[ind,'SideA'],
  target=df.exp[ind,'SideB'],
  type=rep('opposing',length(ind)),
  stringsAsFactors=F))
edges <- unique(edges)

edges <- arrange(edges,year,target,source)

# Write edge list out to CSV
write.csv(edges,'./data/edge_list.csv',row.names=F)
