import ProcessNote from "../models/ProcessNote.js";
export const addProcessNote = async (req, res) => {
    try {
        const { files, body } = req;
        const newNote = new ProcessNote({
            ...body,
            businessAttachment: files.businessAttachment ? files.businessAttachment[0].filename : null,
            attachment: files.attachment ? files.attachment[0].filename : null,
        });
        await newNote.save();
        res.status(201).json({ message: "Process Note created successfully!" });
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
};
export const getAllProcessNotes = async (req, res) => {
    try {
        const { role, username, status } = req.query;
        console.log(`\n--- [GET NOTES] Received Request ---`);
        console.log(`Params:`, { role, username, status });
        
        const query = {};

        if (status) query.status = status;

        if (status === 'draft') {
            query.createdBy = username;
        } else if (status === 'submitted' && role && username) {
            query[`approvalFlow.${role}`] = username;
        }

        console.log(`[GET NOTES] Executing database query:`, query);
        const notes = await ProcessNote.find(query).sort({ createdAt: -1 });
        console.log(`[GET NOTES] Query found ${notes.length} notes.`);
        
        return res.status(200).json(notes);
    } catch (err) {
        console.error("🔥 ERROR in getAllProcessNotes:", err);
        res.status(500).json({ message: "Server Error", error: err.message });
    }
};
export const getProcessById = async (req, res) => {
    try {
        const note = await ProcessNote.findById(req.params.id);
        if (!note) return res.status(404).json({ message: "Process note not found" });
        res.status(200).json(note);
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
};
export const approveProcessNote = async (req, res) => {
    try {
        const note = await ProcessNote.findById(req.params.id);
        if (!note) return res.status(404).json({ message: "Note not found" });

        const currentUser = req.body.username;
        console.log(`\n--- [APPROVAL] User '${currentUser}' is approving note ID '${note._id}' ---`);
        console.log('[APPROVAL] Approval flow BEFORE changes:', JSON.stringify(note.approvalFlow));
        
        const approvalFlow = note.approvalFlow || {};
        const approvalOrder = [ "step1", "step2", "hod", "zfc", "step3a", "step3b", "step4", "director", "cr", "gmfin", "cfo", "cooint", "rpteam", "ceo", "fwpan" ];

        let currentStepRole = approvalOrder.find(role => approvalFlow[role] === currentUser);

        if (!currentStepRole) {
            console.error(`[APPROVAL] ERROR: User '${currentUser}' was not found as an active approver in the flow.`);
            return res.status(403).json({ message: "You are not the designated approver for this step." });
        }
        console.log(`[APPROVAL] User's role was identified as: '${currentStepRole}'.`);

        note.approvalFlow[currentStepRole] = null;

        const currentStepIndex = approvalOrder.indexOf(currentStepRole);
        const nextApproverExists = approvalOrder.slice(currentStepIndex + 1).some(role => approvalFlow[role]);
        console.log(`[APPROVAL] Does a next approver exist in the chain? ${nextApproverExists}`);

        note.status = nextApproverExists ? "submitted" : "approved";
        console.log(`[APPROVAL] Note status is now set to: '${note.status}'.`);
        
        note.markModified('approvalFlow');
        await note.save();
        console.log('[APPROVAL] Note updated and saved successfully.');
        res.json({ message: "Note approved successfully." });

    } catch (err) {
        console.error("🔥 Approval error:", err);
        res.status(500).json({ message: "Error approving note", error: err.message });
    }
};
export const rejectProcessNote = async (req, res) => {
    try {
        const note = await ProcessNote.findById(req.params.id);
        if (!note) return res.status(404).json({ message: "Note not found" });
        
        note.status = "draft";
        
        await note.save();
        res.json({ message: "Note sent back to creator" });
    } catch (err) {
        res.status(500).json({ message: "Error rejecting note", error: err.message });
    }
};
export const getRoleCounts = async (req, res) => {
    try {
        const notes = await ProcessNote.find({ status: "submitted" });
        const roleCounts = {};

        notes.forEach((note) => {
            const flow = note.approvalFlow || {};
            for (let [role, user] of Object.entries(flow)) {
                if (user) {
                    roleCounts[role] = (roleCounts[role] || 0) + 1;
                    break;
                }
            }
        });
        res.json(roleCounts);
    } catch (err) {
        res.status(500).json({ message: "Error fetching role counts", error: err.message });
    }
};
export const updateProcessNote = async (req, res) => {
    try {
        const updatedNote = await ProcessNote.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedNote) return res.status(404).json({ message: "Note not found" });
        res.json({ message: "Note updated successfully", data: updatedNote });
    } catch (err) {
        res.status(500).json({ message: "Error updating note", error: err.message });
    }
};