# Application Flowcharts

This document contains various flowcharts describing the ng-gighub application flows using Mermaid syntax.

## User Authentication Flow

```mermaid
flowchart TD
    A[Start] --> B{User Logged In?}
    B -->|Yes| C[Show Dashboard]
    B -->|No| D[Show Login Page]
    D --> E{User Action}
    E -->|Login| F[Enter Credentials]
    E -->|Register| G[Enter Registration Info]
    F --> H[Validate Credentials]
    G --> I[Validate Registration Data]
    H -->|Valid| J[Create Session]
    H -->|Invalid| K[Show Error]
    I -->|Valid| L[Create User Account]
    I -->|Invalid| M[Show Validation Errors]
    K --> D
    M --> G
    L --> J
    J --> N[Set Auth Token]
    N --> O[Redirect to Dashboard]
    O --> C
    C --> P[End]
```

## Post Creation Flow

```mermaid
flowchart TD
    A[User Clicks Create Post] --> B{User Authenticated?}
    B -->|No| C[Redirect to Login]
    B -->|Yes| D[Show Post Editor]
    D --> E[User Writes Content]
    E --> F{User Action}
    F -->|Save Draft| G[Save to Local Storage]
    F -->|Preview| H[Show Preview Modal]
    F -->|Publish| I[Validate Post Data]
    G --> D
    H --> D
    I -->|Invalid| J[Show Validation Errors]
    I -->|Valid| K[Submit to API]
    J --> D
    K --> L{API Response}
    L -->|Success| M[Show Success Message]
    L -->|Error| N[Show Error Message]
    M --> O[Redirect to Post View]
    N --> D
    O --> P[End]
    C --> Q[End]
```

## Comment System Flow

```mermaid
flowchart TD
    A[User Views Post] --> B[Load Comments]
    B --> C[Display Comment Thread]
    C --> D{User Action}
    D -->|Reply| E{Authenticated?}
    D -->|Like Comment| F{Authenticated?}
    D -->|Report| G{Authenticated?}
    E -->|No| H[Show Login Prompt]
    E -->|Yes| I[Show Reply Editor]
    F -->|No| H
    F -->|Yes| J[Toggle Like Status]
    G -->|No| H
    G -->|Yes| K[Show Report Form]
    I --> L[User Types Reply]
    L --> M{Submit Reply}
    M --> N[Validate Content]
    N -->|Invalid| O[Show Error]
    N -->|Valid| P[Submit to API]
    O --> I
    P --> Q{API Response}
    Q -->|Success| R[Update Comment Thread]
    Q -->|Error| S[Show Error Message]
    R --> C
    S --> I
    J --> T[Update Like Count]
    T --> C
    K --> U[Submit Report]
    U --> V[Show Confirmation]
    V --> C
    H --> W[End]
```

## Search Flow

```mermaid
flowchart TD
    A[User Enters Search Query] --> B{Query Length >= 3?}
    B -->|No| C[Show Minimum Length Message]
    B -->|Yes| D[Debounce Input]
    D --> E[Show Loading Indicator]
    E --> F[Call Search API]
    F --> G{API Response}
    G -->|Success| H{Results Found?}
    G -->|Error| I[Show Error Message]
    H -->|Yes| J[Display Results]
    H -->|No| K[Show No Results Message]
    J --> L{User Action}
    L -->|Click Result| M[Navigate to Item]
    L -->|Refine Search| A
    L -->|Clear Search| N[Reset Search]
    K --> L
    I --> O[Log Error]
    O --> K
    M --> P[End]
    N --> P
    C --> Q[Wait for More Input]
    Q --> A
```

## Data Synchronization Flow

```mermaid
flowchart TD
    A[Application Start] --> B[Load Initial Data]
    B --> C[Initialize WebSocket Connection]
    C --> D{Connection Status}
    D -->|Connected| E[Subscribe to Updates]
    D -->|Failed| F[Use Polling Fallback]
    E --> G[Listen for Events]
    F --> H[Poll Every 30s]
    G --> I{Event Received}
    H --> J{New Data?}
    I -->|Update Event| K[Update Local State]
    I -->|Delete Event| L[Remove from Local State]
    I -->|Create Event| M[Add to Local State]
    J -->|Yes| K
    J -->|No| H
    K --> N[Trigger UI Re-render]
    L --> N
    M --> N
    N --> O{Connection Lost?}
    O -->|Yes| P[Show Offline Warning]
    O -->|No| G
    P --> Q[Attempt Reconnection]
    Q --> R{Reconnected?}
    R -->|Yes| S[Sync Missed Updates]
    R -->|No| T[Wait and Retry]
    S --> G
    T --> Q
```

## Error Handling Flow

```mermaid
flowchart TD
    A[Error Occurs] --> B{Error Type}
    B -->|Network Error| C[Check Connectivity]
    B -->|Auth Error| D[Check Token Validity]
    B -->|Validation Error| E[Show Field Errors]
    B -->|Server Error| F[Log Error Details]
    B -->|Unknown Error| G[Log to Console]
    C --> H{Online?}
    H -->|Yes| I[Retry Request]
    H -->|No| J[Show Offline Message]
    I --> K{Success?}
    K -->|Yes| L[Continue]
    K -->|No| M[Show Error Toast]
    D --> N{Token Valid?}
    N -->|No| O[Redirect to Login]
    N -->|Yes| P[Refresh Token]
    P --> Q{Refresh Success?}
    Q -->|Yes| L
    Q -->|No| O
    E --> R[Highlight Invalid Fields]
    F --> S[Show Generic Error]
    G --> S
    J --> T[Enable Offline Mode]
    M --> U[Allow User Retry]
    R --> U
    S --> U
    O --> V[End]
    L --> V
    T --> V
```

## Notes
- All flowcharts are rendered using Mermaid syntax
- Flowcharts can be viewed in GitHub or any Mermaid-compatible markdown viewer
- Update these diagrams when application flows change
- Use consistent naming conventions for nodes and actions
