const express = require('express');
const app = express();
const PORT = 3001;

let agents = [
   {
    code: "A001",
    name: "Tech",
    status: "Available",
    loginTime: new Date()
   },
   {
    code: "A002",
    name: "Mar",
    status: "Wrap-up",
    loginTime: new Date()
   },
   {
    code: "A003",
    name: "Zack",
    status: "Active", 
    loginTime: new Date()
   },
];

app.use(express.json());

app.patch('/api/agents/:code/status', (req, res) => {
    const agentCode = req.params.code;
    const newStatus = req.body.status;
    
    console.log('Agent Code:', agentCode);
    console.log('New Status:', newStatus);

    const agent = agents.find(a => a.code === agentCode)
    console.log('finding:', agent);

    if (!agent) {
        return res.status(404).json({
            success: false,
            error: "Agent not found"
        });
    }

    const validStatuses = ["Available", "Active", "Wrap Up", "Not Ready", "Offline"];
    
    if (!validStatuses.includes(newStatus)) {
        return res.status(400).json({
            success: false,
            error: "Invalid status",
            validStatuses: validStatuses
        });
    }  

    const oldStatus = agent.status;

    agent.status = newStatus;
    agent.lastStatusChange = new Date();

    console.log('current agent :',agent);

    res.json({
        success: true,
        message: `Agent ${agentCode} status changed from ${oldStatus} to ${newStatus}`,
        data: agent
    });


});


app.get('/api/agents', (req, res) => {
   
    res.json({
        success: true,
        data: agents,
        count: agents.length,
        timestamp: new Date().toISOString()
    });

});

app.get('/api/agents/count', (req, res) => {
   
    res.json({
        success: true,
        count: agents.length,
        timestamp: new Date().toISOString()
    });

});


app.get('/', (req, res) => {
    res.send(`Hello Agent Wallboard!`);
});

app.get('/hello', (req, res) => {
    res.send(`Hello สวัสดี!`);
});

app.get('/health', (req, res) => {
    res.send({ 
        status: 'OK', 
        timestamp: new Date().toISOString() 
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
