OpenZeppelin Governor
Compatibility considerations when implementing OpenZeppelin governor

To be compatible with the Tally app we recommend you to use OpenZeppelin's library Governor contract. If you want to implement changes to this base contract, here is the interface that you should follow to make sure your contract works with our app.

Event signatures
Tally's API listens to event logs from Governor contracts when indexing them. Your contract will need to maintain the same event signatures that OZ Governor implements:

Copy
event ProposalCreated(
    uint256 proposalId,
    address proposer,
    address[] targets,
    uint256[] values,
    string[] signatures,
    bytes[] calldatas,
    uint256 startBlock,
    uint256 endBlock,
    string description
);

event ProposalQueued(uint256 proposalId, uint256 etaSeconds);
event ProposalCanceled(uint256 proposalId);
event ProposalExecuted(uint256 proposalId);

event VoteCast(
    address indexed voter, 
    uint256 proposalId, 
    uint8 support, 
    uint256 weight, 
    string reason
);
Function signatures
Tally's frontend app helps users make web3 calls to your Governor contract. The app lets users create Proposals as well as vote on, queue and execute them.  In addition, the app reads state from the contract with function calls. 

To be compatible with Tally, your Governor will need these function signatures:

Copy
function votingDelay() public view virtual returns (uint256);
function votingPeriod() public view virtual returns (uint256);
function quorum(uint256 timepoint) public view virtual returns (uint256);
function proposalThreshold() public view virtual returns (uint256);
function state(uint256 proposalId) public view virtual override returns (
    ProposalState
);

function getVotes(
    address account, 
    uint256 timepoint
) public view virtual returns (uint256);

function propose(
    address[] memory targets,
    uint256[] memory values,
    bytes[] memory calldatas,
    string memory description
) public virtual returns (uint256 proposalId);

function execute(
    address[] memory targets,
    uint256[] memory values,
    bytes[] memory calldatas,
    bytes32 descriptionHash
) public payable virtual returns (uint256 proposalId);

function castVote(
    uint256 proposalId, 
    uint8 support
) public virtual returns (uint256 balance);

function castVoteWithReason(
    uint256 proposalId,
    uint8 support,
    string calldata reason
) public virtual returns (uint256 balance);

function castVoteBySig(
    uint256 proposalId,
    uint8 support,
    uint8 v,
    bytes32 r,
    bytes32 s
) public virtual returns (uint256 balance);
If your OpenZeppelin governor contract uses a Timelock, it will also need this signature:

Copy
function queue(
    address[] memory targets,
    uint256[] memory values,
    bytes[] memory calldatas,
    bytes32 descriptionHash
) public virtual override returns (uint256)
Quorum
Tally needs the quorum to calculate if a proposal has passed. That means that Tally requires the Governor to have a quorum() function:

Copy
function quorum(uint256 timepoint) public view virtual returns (uint256);
Optionally, Tally also supports the quorumNumerator() and quorumDenominator() functions. Governors with quorums that are a function of token supply should implement these functions:

Copy
function quorumNumerator() public view virtual returns (uint256);
function quorumDenominator() public view virtual returns (uint256);
If the Governor is missing either quorumNumerator() or quorumDenominator(), Tally falls back to the quorum() function and assumes that the quorum is fixed. 

Voting Delay
Tally needs to know the voting delay to calculate when voting starts without polling the blockchain. A votingDelay() function on Governor is required:

Copy
function votingDelay() public view virtual returns (uint256);
Voting Period
Tally needs to know the voting period to calculate when a proposal finishes voting without polling the blockchain. A votingPeriod() function on Governor is required:

Copy
function votingPeriod() public view virtual returns (uint256);
Proposal state lifecycle
Tally's app expects the following proposal states. If your Governor uses a custom proposal lifecycle, those states won't show up correctly on on Tally:

Copy
enum ProposalState {
    Pending,
    Active,
    Canceled,
    Defeated,
    Succeeded,
    Queued,
    Expired,
    Executed
}
Governor Parameter Changes
Governors can change their own parameters, like proposal times and the amount of voting power required to create and pass proposals. To make sure that Tally indexes your Governor's parameter changes, implement these event signatures:

Copy
 event VotingDelaySet(uint256 oldVotingDelay, uint256 newVotingDelay);
 event VotingPeriodSet(uint256 oldVotingPeriod, uint256 newVotingPeriod);
 event ProposalThresholdSet(uint256 oldProposalThreshold, uint256 newProposalThreshold);
 event QuorumNumeratorUpdated(uint256 oldQuorumNumerator, uint256 newQuorumNumerator);
If your OpenZeppelin governor contract uses a Timelock, it will also need this event:

Copy
event TimelockChange(address oldTimelock, address newTimelock);
Quorum Extension
Tally handles the ProposalExtended event, which is emitted by governors that implement the PreventLateQuorum extension:

Copy
event ProposalExtended(uint256 indexed proposalId, uint64 extendedDeadline);
Clock Mode
Since Governor v4.9, all voting contracts (including ERC20Votes and ERC721Votes) rely on IERC6372 for clock management. The Governor will automatically detect the clock mode used by the token and adapt to it. There is no need to override anything in the Governor contract. You can learn more about compatibility of your token and Governor contract with clock mode here. 

Tally checks the contract lock using the IERC-6372 standard. We accept blocknumber and timestamp clock modes.Specifically, Tally expects Governor and token contracts to implement a CLOCK_MODE() function that returns either mode=blocknumber&from=default or mode=blocknumber&from=<CAIP-2-ID> . If the call to the governor's CLOCK_MODE() method returns mode=timestamp then proposal start and end times will be interpreted as unix timestamps otherwise they will be interpreted as block numbers.

If you're interested in support for another contract clock, Tally would need to do some custom work. Get in touch with biz@tally.xyz.