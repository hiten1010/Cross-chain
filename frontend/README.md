# Enhanced LangChain Agent Architecture

```mermaid
graph TB
    %% Main Agent Nodes
    Planner[🧠 Planner]
    Dispatcher[🚦 Dispatcher]
    DataFetchAgent[🔄 DataFetchAgent]
    SimulationAgent[🔬 SimulationAgent]
    ResearchAgent[🔍 ResearchAgent]
    GreetingAgent[👋 GreetingAgent]
    Aggregator[📊 Aggregator]
    Critic[🔍 Critic]
    Formatter[📝 Formatter]
    Response[💬 Final Response]
    
    %% Tools
    GetRoadmapInfo[📊 get_roadmap_info]
    GetLinkedProjects[🔗 get_linked_projects]
    GetRoadmapIdByName[🔍 get_roadmap_id_by_name]
    GetProjectStatusReason[❓ get_project_status_with_reason]
    GetTasks[📝 get_tasks]
    GetUnallocatedTasks[❌ get_unallocated_tasks]
    AllocateResource[👥 allocate_resource_to_task_by_id]
    
    %% Agent Flow
    Planner --> Dispatcher
    Dispatcher --> DataFetchAgent
    Dispatcher --> SimulationAgent
    Dispatcher --> ResearchAgent
    Dispatcher --> GreetingAgent
    
    %% Agent Results Flow
    DataFetchAgent --> Aggregator
    SimulationAgent --> Aggregator
    ResearchAgent --> Aggregator
    GreetingAgent --> Formatter
    
    %% Linear Chain
    Aggregator --> Critic
    Critic --> Formatter
    Formatter --> Response
    
    %% Tool Connections - Unified to DataFetchAgent
    DataFetchAgent --> GetRoadmapInfo
    DataFetchAgent --> GetLinkedProjects
    DataFetchAgent --> GetRoadmapIdByName
    DataFetchAgent --> GetProjectStatusReason
    DataFetchAgent --> GetTasks
    DataFetchAgent --> GetUnallocatedTasks
    DataFetchAgent --> AllocateResource
    
    %% Database Layer
    DataLayer[🗄️ Unified Data Layer]
    
    %% Tool Database Connections
    GetRoadmapInfo --> DataLayer
    GetLinkedProjects --> DataLayer
    GetRoadmapIdByName --> DataLayer
    GetProjectStatusReason --> DataLayer
    GetTasks --> DataLayer
    GetUnallocatedTasks --> DataLayer
    AllocateResource --> DataLayer
    
    %% Styling
    classDef agentNode fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    classDef toolNode fill:#e8f5e8,stroke:#1b5e20,stroke-width:2px
    classDef dbNode fill:#fff3e0,stroke:#e65100,stroke-width:2px
    classDef responseNode fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    classDef dataFetchNode fill:#bbdefb,stroke:#1565c0,stroke-width:3px
    
    class Planner,Dispatcher,SimulationAgent,ResearchAgent,GreetingAgent,Aggregator,Critic,Formatter agentNode
    class DataFetchAgent dataFetchNode
    class GetRoadmapInfo,GetLinkedProjects,GetRoadmapIdByName,GetProjectStatusReason,GetTasks,GetUnallocatedTasks,AllocateResource toolNode
    class DataLayer dbNode
    class Response responseNode
```

## Enhanced Architecture Benefits

### Streamlined Agent Structure
- **Unified DataFetchAgent**: Consolidates both roadmap and project data retrieval functions into a single, specialized agent
- **Reduced Context Switching**: Eliminates the need to route between multiple data agents
- **Simplified Decision Logic**: Dispatcher needs fewer routing rules
- **Faster Processing**: Single agent handles all data retrieval operations

### Optimized Data Layer
- **Unified Data Access**: All tools connect to a consolidated data layer
- **Improved Caching**: Single agent can implement shared caching strategies
- **Consistent Error Handling**: Standardized approach across all data operations

### Tool Integration
- **Tool Reuse**: All data retrieval tools available to a single agent
- **Context Preservation**: Agent maintains context across different data queries
- **Parallel Processing**: Can batch similar data requests together

## Component Descriptions

### Agents
- **Planner**: Creates execution plans based on user queries
- **Dispatcher**: Routes tasks to specialized agents
- **DataFetchAgent**: Unified agent handling all data retrieval operations (roadmap and project data)
- **SimulationAgent**: Runs simulations and predictions
- **ResearchAgent**: Gathers information and research
- **GreetingAgent**: Handles simple user greetings
- **Aggregator**: Combines results from multiple agents
- **Critic**: Evaluates response quality
- **Formatter**: Performs final text formatting and delivers the response to user

### Tools
- **get_roadmap_info**: Retrieves basic information about a roadmap
- **get_linked_projects**: Gets projects linked to a roadmap
- **get_roadmap_id_by_name**: Finds roadmap ID from name
- **get_project_status_with_reason**: Gets project status with explanation
- **get_tasks**: Returns list of tasks for a project
- **get_unallocated_tasks**: Lists tasks with missing resources
- **allocate_resource_to_task_by_id**: Assigns resources to tasks 
