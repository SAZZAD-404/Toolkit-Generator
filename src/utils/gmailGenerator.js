const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const firstNames = {
  male: {
    usa: [
      'james', 'john', 'robert', 'michael', 'william', 'david', 'richard', 'joseph', 'thomas', 'charles',
      'christopher', 'daniel', 'matthew', 'anthony', 'mark', 'donald', 'steven', 'paul', 'andrew', 'joshua',
      'kenneth', 'kevin', 'brian', 'george', 'timothy', 'ronald', 'edward', 'jason', 'jeffrey', 'ryan',
      'jacob', 'gary', 'nicholas', 'eric', 'jonathan', 'stephen', 'larry', 'justin', 'scott', 'brandon',
      'benjamin', 'samuel', 'raymond', 'gregory', 'frank', 'alexander', 'patrick', 'jack', 'dennis', 'jerry',
      'tyler', 'aaron', 'jose', 'adam', 'nathan', 'henry', 'douglas', 'zachary', 'peter', 'kyle',
      'noah', 'ethan', 'jeremy', 'walter', 'christian', 'keith', 'roger', 'terry', 'austin', 'sean',
      'gerald', 'carl', 'harold', 'dylan', 'arthur', 'lawrence', 'jordan', 'jesse', 'bryan', 'billy',
      'bruce', 'gabriel', 'joe', 'logan', 'albert', 'willie', 'alan', 'eugene', 'russell', 'vincent',
      'philip', 'bobby', 'johnny', 'bradley', 'roy', 'ralph', 'randy', 'wayne', 'howard', 'carlos',
      'louis', 'harry', 'martin', 'fred', 'leonard', 'clarence', 'ernest', 'todd', 'craig', 'shawn',
      'chris', 'earl', 'jimmy', 'antonio', 'danny', 'tony', 'luis', 'mike', 'stanley', 'marcus',
      'theodore', 'clifford', 'miguel', 'oscar', 'jay', 'jim', 'tom', 'calvin', 'alex', 'jon',
      'ronnie', 'bill', 'lloyd', 'tommy', 'leon', 'derek', 'warren', 'darrell', 'jerome', 'floyd',
      'leo', 'alvin', 'tim', 'wesley', 'gordon', 'dean', 'greg', 'jorge', 'dustin', 'pedro',
      'derrick', 'dan', 'lewis', 'corey', 'herman', 'maurice', 'vernon', 'roberto', 'clyde', 'glen',
      'hector', 'shane', 'ricardo', 'sam', 'rick', 'lester', 'brent', 'ramon', 'charlie', 'gilbert',
      'gene', 'marc', 'reginald', 'ruben', 'brett', 'angel', 'nathaniel', 'rafael', 'leslie', 'edgar',
      'milton', 'raul', 'ben', 'chester', 'cecil', 'duane', 'franklin', 'andre', 'elmer', 'brad',
      'ron', 'mitchell', 'roland', 'arnold', 'harvey', 'jared', 'adrian', 'karl', 'cory', 'claude',
      'erik', 'darryl', 'jamie', 'neil', 'jessie', 'javier', 'fernando', 'clinton', 'ted', 'mathew',
      'tyrone', 'darren', 'lonnie', 'lance', 'cody', 'julio', 'kelly', 'kurt', 'allan', 'nelson',
      'guy', 'clayton', 'hugh', 'max', 'dwayne', 'dwight', 'armando', 'felix', 'jimmie', 'everett',
      'ian', 'wallace', 'ken', 'bob', 'jaime', 'casey', 'alfredo', 'alberto', 'dave', 'ivan',
      'johnnie', 'sidney', 'byron', 'julian', 'isaac', 'morris', 'clifton', 'willard', 'daryl', 'ross',
      'virgil', 'andy', 'marshall', 'salvador', 'perry', 'kirk', 'sergio', 'marion', 'tracy', 'seth',
      'kent', 'terrance', 'rene', 'eduardo', 'terrence', 'enrique', 'freddie', 'wade', 'stuart', 'fredrick',
      'arturo', 'alejandro', 'jackie', 'joey', 'nick', 'luther', 'wendell', 'jeremiah', 'evan', 'julius',
      'dana', 'donnie', 'otis', 'shannon', 'trevor', 'oliver', 'luke', 'homer', 'gerard', 'doug',
      'kenny', 'hubert', 'angelo', 'shaun', 'lyle', 'matt', 'lynn', 'alfonso', 'orlando', 'rex',
      'carlton', 'ernesto', 'cameron', 'neal', 'pablo', 'lorenzo', 'omar', 'wilbur', 'blake', 'grant',
      'horace', 'roderick', 'kerry', 'abraham', 'willis', 'rickey', 'jean', 'ira', 'andres', 'cesar',
      'johnathan', 'malcolm', 'rudolph', 'damon', 'kelvin', 'rudy', 'preston', 'alton', 'archie', 'marco',
      'pete', 'randolph', 'garry', 'geoffrey', 'jonathon', 'felipe', 'bennie', 'gerardo', 'ed', 'dominic',
      'robin', 'loren', 'delbert', 'colin', 'guillermo', 'earnest', 'lucas', 'benny', 'noel', 'spencer',
      'rodolfo', 'myron', 'edmund', 'garrett', 'salvatore', 'cedric', 'lowell', 'gregg', 'sherman', 'wilson',
      'devin', 'sylvester', 'kim', 'roosevelt', 'israel', 'jermaine', 'forrest', 'wilbert', 'leland', 'simon',
      'guadalupe', 'clark', 'irving', 'carroll', 'bryant', 'owen', 'rufus', 'woodrow', 'sammy', 'kristopher',
      'mack', 'levi', 'marcos', 'gustavo', 'jake', 'lionel', 'marty', 'taylor', 'ellis', 'dallas',
      'gilberto', 'clint', 'nicolas', 'laurence', 'ismael', 'orville', 'drew', 'jody', 'ervin', 'dewey',
      'al', 'wilfred', 'josh', 'hugo', 'ignacio', 'caleb', 'tomas', 'sheldon', 'erick', 'frankie',
      'stewart', 'doyle', 'darrel', 'rogelio', 'terence', 'santiago', 'alonzo', 'elias', 'bert', 'elbert',
      'ramiro', 'conrad', 'pat', 'grady', 'phil', 'cornelius', 'lamar', 'rolando', 'clay', 'percy',
      'dexter', 'bradford', 'merle', 'darin', 'amos', 'terrell', 'moses', 'irvin', 'saul', 'roman',
      'darnell', 'randal', 'tommie', 'timmy', 'darrin', 'winston', 'brendan', 'toby', 'van', 'abel',
      'dominick', 'boyd', 'courtney', 'jan', 'emilio', 'elijah', 'cary', 'domingo', 'santos', 'aubrey',
      'emmett', 'marlon', 'emanuel', 'jerald', 'edmond', 'emil', 'dewayne', 'will', 'otto', 'teddy',
      'reynaldo', 'bret', 'morgan', 'jess', 'trent', 'humberto', 'emmanuel', 'stephan', 'louie', 'vicente',
      'lamont', 'stacy', 'garland', 'miles', 'micah', 'efrain', 'billie', 'heath', 'rodger', 'harley',
      'demetrius', 'eldon', 'rocky', 'pierre', 'junior', 'freddy', 'eli', 'bryce', 'antoine', 'robbie',
      'kendall', 'royce', 'sterling', 'mickey', 'chase', 'grover', 'elton', 'cleveland', 'dylan', 'chuck',
      'damian', 'reuben', 'stan', 'august', 'leonardo', 'jasper', 'russel', 'erwin', 'benito', 'hans',
      'monte', 'blaine', 'ernie', 'curt', 'quentin', 'agustin', 'murray', 'jamal', 'devon', 'adolfo',
      'harrison', 'tyson', 'burton', 'brady', 'elliott', 'wilfredo', 'bart', 'jarrod', 'vance', 'denis',
      'damien', 'joaquin', 'harlan', 'desmond', 'elliot', 'darwin', 'ashley', 'gregorio', 'buddy', 'xavier',
      'kermit', 'roscoe', 'esteban', 'anton', 'solomon', 'scotty', 'norbert', 'elvin', 'williams', 'nolan',
      'carey', 'rod', 'quinton', 'hal', 'brain', 'rob', 'elwood', 'kendrick', 'darius', 'moises'
    ],
    uk: [
      'oliver', 'george', 'harry', 'noah', 'jack', 'leo', 'jacob', 'freddie', 'alfie', 'oscar',
      'charlie', 'henry', 'archie', 'thomas', 'joshua', 'james', 'william', 'arthur', 'edward', 'alexander',
      'daniel', 'samuel', 'joseph', 'benjamin', 'lucas', 'ethan', 'max', 'logan', 'isaac', 'adam',
      'ryan', 'dylan', 'nathan', 'connor', 'luke', 'matthew', 'jake', 'lewis', 'harrison', 'sebastian',
      'finley', 'teddy', 'theo', 'mason', 'reuben', 'louie', 'harvey', 'tommy', 'jude', 'toby',
      'elliot', 'felix', 'frankie', 'bobby', 'reggie', 'stanley', 'albert', 'ronnie', 'ralph', 'hugo',
      'luca', 'ellis', 'blake', 'caleb', 'jasper', 'louis', 'dexter', 'jenson', 'kai', 'leon'
    ],
    germany: [
      'maximilian', 'alexander', 'paul', 'elias', 'leon', 'louis', 'jonas', 'noah', 'felix', 'lukas',
      'ben', 'finn', 'emil', 'oskar', 'theo', 'luca', 'henry', 'moritz', 'julian', 'david',
      'niklas', 'tim', 'jan', 'philipp', 'simon', 'fabian', 'sebastian', 'tobias', 'florian', 'daniel',
      'matthias', 'johannes', 'michael', 'andreas', 'christian', 'thomas', 'stefan', 'markus', 'martin', 'peter',
      'erik', 'max', 'leo', 'anton', 'carl', 'jonathan', 'vincent', 'samuel', 'jakob', 'matteo',
      'linus', 'hannes', 'lennard', 'nico', 'rafael', 'aaron', 'mats', 'till', 'ole', 'nils'
    ],
    france: [
      'gabriel', 'louis', 'raphael', 'jules', 'arthur', 'adam', 'lucas', 'hugo', 'nathan', 'leo',
      'ethan', 'theo', 'tom', 'noah', 'liam', 'paul', 'victor', 'maxime', 'antoine', 'alexandre',
      'thomas', 'nicolas', 'pierre', 'jean', 'michel', 'philippe', 'francois', 'laurent', 'christophe', 'david',
      'mathieu', 'julien', 'sebastien', 'olivier', 'stephane', 'eric', 'patrick', 'frederic', 'pascal', 'bruno',
      'clement', 'romain', 'benjamin', 'florian', 'kevin', 'jeremy', 'guillaume', 'vincent', 'damien', 'yann',
      'quentin', 'alexis', 'valentin', 'bastien', 'corentin', 'enzo', 'matteo', 'titouan', 'axel', 'evan'
    ],
    canada: [
      'liam', 'noah', 'benjamin', 'oliver', 'lucas', 'william', 'ethan', 'jacob', 'james', 'alex',
      'logan', 'jack', 'thomas', 'owen', 'charlie', 'henry', 'theodore', 'leo', 'jackson', 'aiden',
      'sebastian', 'matthew', 'daniel', 'michael', 'alexander', 'nathan', 'ryan', 'samuel', 'david', 'joseph',
      'andrew', 'joshua', 'christopher', 'tyler', 'dylan', 'connor', 'evan', 'adam', 'luke', 'aaron',
      'gabriel', 'isaac', 'mason', 'jayden', 'hunter', 'caleb', 'brandon', 'jordan', 'austin', 'cameron',
      'zachary', 'cole', 'chase', 'blake', 'dominic', 'xavier', 'parker', 'carter', 'miles', 'max'
    ],
    australia: [
      'oliver', 'noah', 'william', 'jack', 'leo', 'lucas', 'thomas', 'henry', 'charlie', 'isaac',
      'hudson', 'liam', 'james', 'ethan', 'mason', 'alexander', 'jacob', 'michael', 'benjamin', 'daniel',
      'matthew', 'joshua', 'ryan', 'samuel', 'nathan', 'harrison', 'cooper', 'hunter', 'archie', 'oscar',
      'max', 'felix', 'sebastian', 'theodore', 'finn', 'jasper', 'xavier', 'blake', 'connor', 'dylan',
      'tyler', 'jordan', 'cameron', 'logan', 'aiden', 'jayden', 'riley', 'luke', 'aaron', 'adam',
      'evan', 'caleb', 'austin', 'zachary', 'brandon', 'kyle', 'patrick', 'sean', 'marcus', 'dominic'
    ],
    italy: [
      'francesco', 'leonardo', 'alessandro', 'lorenzo', 'mattia', 'andrea', 'gabriele', 'riccardo', 'tommaso', 'edoardo',
      'giuseppe', 'antonio', 'marco', 'luca', 'giovanni', 'matteo', 'davide', 'federico', 'nicolo', 'filippo',
      'simone', 'pietro', 'diego', 'samuele', 'christian', 'daniele', 'emanuele', 'jacopo', 'alberto', 'stefano',
      'michele', 'vincenzo', 'salvatore', 'domenico', 'raffaele', 'carlo', 'paolo', 'sergio', 'massimo', 'fabio',
      'claudio', 'roberto', 'franco', 'mario', 'luigi', 'enrico', 'giorgio', 'bruno', 'angelo', 'alfredo'
    ],
    spain: [
      'lucas', 'hugo', 'martin', 'daniel', 'pablo', 'alejandro', 'manuel', 'alvaro', 'adrian', 'david',
      'javier', 'sergio', 'carlos', 'diego', 'miguel', 'antonio', 'jose', 'francisco', 'juan', 'pedro',
      'rafael', 'fernando', 'luis', 'ramon', 'alberto', 'enrique', 'jorge', 'andres', 'victor', 'mario',
      'oscar', 'ivan', 'ruben', 'angel', 'marcos', 'jaime', 'guillermo', 'gonzalo', 'ignacio', 'rodrigo',
      'samuel', 'nicolas', 'mateo', 'leo', 'marc', 'pol', 'eric', 'alex', 'iker', 'aitor'
    ],
    austria: [
      'maximilian', 'david', 'jakob', 'felix', 'elias', 'paul', 'lukas', 'tobias', 'leon', 'jonas',
      'noah', 'alexander', 'simon', 'moritz', 'raphael', 'florian', 'sebastian', 'michael', 'daniel', 'thomas',
      'stefan', 'andreas', 'christian', 'markus', 'martin', 'peter', 'johannes', 'matthias', 'philipp', 'benjamin',
      'julian', 'niklas', 'fabian', 'dominik', 'patrick', 'manuel', 'marcel', 'kevin', 'dennis', 'sascha'
    ],
    switzerland: [
      'noah', 'liam', 'leon', 'luca', 'gabriel', 'julian', 'david', 'louis', 'samuel', 'daniel',
      'nico', 'elias', 'matteo', 'finn', 'leo', 'jan', 'tim', 'lukas', 'jonas', 'felix',
      'max', 'ben', 'alexander', 'simon', 'fabian', 'florian', 'tobias', 'michael', 'thomas', 'stefan',
      'andreas', 'christian', 'markus', 'martin', 'peter', 'marc', 'patrick', 'pascal', 'reto', 'beat'
    ],
    netherlands: [
      'sem', 'lucas', 'finn', 'daan', 'levi', 'milan', 'jesse', 'noah', 'james', 'benjamin',
      'luuk', 'bram', 'thijs', 'lars', 'max', 'thomas', 'tim', 'ruben', 'julian', 'stijn',
      'sven', 'nick', 'rick', 'bas', 'tom', 'kevin', 'dennis', 'mark', 'peter', 'jan',
      'pieter', 'willem', 'hendrik', 'johannes', 'cornelis', 'gerrit', 'dirk', 'jacob', 'adriaan', 'martijn'
    ],
    sweden: [
      'lucas', 'liam', 'william', 'elias', 'noah', 'oliver', 'oscar', 'hugo', 'adam', 'alexander',
      'axel', 'emil', 'theo', 'isak', 'viktor', 'erik', 'carl', 'gustav', 'johan', 'anders',
      'lars', 'per', 'nils', 'sven', 'olof', 'magnus', 'henrik', 'peter', 'stefan', 'mikael',
      'daniel', 'david', 'martin', 'jonas', 'mattias', 'andreas', 'fredrik', 'christian', 'marcus', 'simon'
    ],
    denmark: [
      'william', 'noah', 'oscar', 'lucas', 'victor', 'alfred', 'carl', 'malthe', 'emil', 'valdemar',
      'oliver', 'august', 'magnus', 'frederik', 'christian', 'mikkel', 'mathias', 'sebastian', 'alexander', 'nikolaj',
      'rasmus', 'jonas', 'mads', 'simon', 'jacob', 'peter', 'lars', 'anders', 'thomas', 'martin',
      'henrik', 'jens', 'soren', 'niels', 'erik', 'hans', 'klaus', 'ole', 'finn', 'bjorn'
    ],
    norway: [
      'emil', 'noah', 'oliver', 'william', 'lucas', 'theodor', 'felix', 'oskar', 'isak', 'mathias',
      'filip', 'henrik', 'jakob', 'alexander', 'magnus', 'tobias', 'sebastian', 'jonas', 'martin', 'andreas',
      'thomas', 'lars', 'erik', 'ole', 'per', 'jan', 'hans', 'bjorn', 'arne', 'knut',
      'svein', 'tor', 'geir', 'odd', 'leif', 'rune', 'terje', 'morten', 'trond', 'hakon'
    ],
    newzealand: [
      'oliver', 'jack', 'noah', 'leo', 'lucas', 'thomas', 'george', 'william', 'james', 'henry',
      'charlie', 'mason', 'liam', 'benjamin', 'ethan', 'alexander', 'jacob', 'michael', 'daniel', 'matthew',
      'joshua', 'ryan', 'samuel', 'nathan', 'harrison', 'cooper', 'hunter', 'archie', 'oscar', 'max',
      'felix', 'sebastian', 'theodore', 'finn', 'jasper', 'xavier', 'blake', 'connor', 'dylan', 'tyler'
    ],
    india: [
      'aarav', 'vivaan', 'aditya', 'arjun', 'sai', 'aryan', 'reyansh', 'ayaan', 'krishna', 'ishaan',
      'shaurya', 'atharv', 'advik', 'pranav', 'vihaan', 'dhruv', 'kabir', 'ansh', 'harsh', 'rohan',
      'rahul', 'amit', 'vikram', 'raj', 'ajay', 'vijay', 'suresh', 'ramesh', 'mahesh', 'ganesh',
      'anil', 'sunil', 'sanjay', 'ravi', 'deepak', 'ashok', 'rajesh', 'mukesh', 'dinesh', 'naresh',
      'karan', 'nikhil', 'sahil', 'varun', 'akash', 'vishal', 'kunal', 'gaurav', 'manish', 'pankaj'
    ],
    japan: [
      'haruto', 'yuto', 'sota', 'haruki', 'yuito', 'hinata', 'riku', 'kaito', 'ren', 'sora',
      'yuki', 'hayato', 'takumi', 'ryo', 'daiki', 'kenta', 'shota', 'yuma', 'kazuki', 'naoki',
      'kenji', 'takeshi', 'hiroshi', 'masashi', 'daisuke', 'yusuke', 'kosuke', 'ryosuke', 'keisuke', 'shunsuke',
      'taro', 'jiro', 'ichiro', 'saburo', 'shiro', 'goro', 'akira', 'makoto', 'satoshi', 'hiroki'
    ],
    china: [
      'wei', 'jun', 'ming', 'hao', 'chen', 'yang', 'lei', 'tao', 'jie', 'feng',
      'long', 'bo', 'kai', 'xin', 'yong', 'gang', 'qiang', 'ping', 'lin', 'chao',
      'peng', 'fei', 'yu', 'hua', 'guang', 'jian', 'zhong', 'wen', 'xiang', 'dong',
      'hai', 'shan', 'cheng', 'yi', 'zhi', 'hong', 'da', 'xiao', 'liang', 'bin'
    ],
    brazil: [
      'miguel', 'arthur', 'heitor', 'bernardo', 'theo', 'davi', 'gabriel', 'pedro', 'lucas', 'matheus',
      'rafael', 'guilherme', 'felipe', 'bruno', 'eduardo', 'gustavo', 'henrique', 'rodrigo', 'andre', 'fernando',
      'ricardo', 'carlos', 'paulo', 'jose', 'antonio', 'francisco', 'joao', 'marcos', 'marcelo', 'sergio',
      'claudio', 'roberto', 'fabio', 'leandro', 'diego', 'thiago', 'caio', 'vinicius', 'leonardo', 'daniel'
    ],
    mexico: [
      'santiago', 'mateo', 'sebastian', 'matias', 'diego', 'emiliano', 'daniel', 'alexander', 'leonardo', 'angel',
      'jose', 'luis', 'carlos', 'miguel', 'david', 'juan', 'antonio', 'francisco', 'jesus', 'alejandro',
      'fernando', 'ricardo', 'eduardo', 'rafael', 'jorge', 'andres', 'pedro', 'manuel', 'victor', 'mario',
      'oscar', 'ivan', 'ruben', 'marcos', 'jaime', 'guillermo', 'gonzalo', 'ignacio', 'rodrigo', 'pablo'
    ],
  },
  female: {
    usa: [
      'mary', 'patricia', 'jennifer', 'linda', 'elizabeth', 'barbara', 'susan', 'jessica', 'sarah', 'karen',
      'emily', 'ashley', 'emma', 'olivia', 'sophia', 'nancy', 'betty', 'margaret', 'sandra', 'kimberly',
      'donna', 'michelle', 'dorothy', 'carol', 'amanda', 'melissa', 'deborah', 'stephanie', 'rebecca', 'sharon',
      'laura', 'cynthia', 'kathleen', 'amy', 'angela', 'shirley', 'anna', 'brenda', 'pamela', 'nicole',
      'helen', 'samantha', 'katherine', 'christine', 'debra', 'rachel', 'carolyn', 'janet', 'catherine', 'maria',
      'heather', 'diane', 'ruth', 'julie', 'joyce', 'virginia', 'victoria', 'kelly', 'lauren', 'christina',
      'joan', 'evelyn', 'judith', 'megan', 'andrea', 'cheryl', 'hannah', 'jacqueline', 'martha', 'gloria',
      'teresa', 'ann', 'sara', 'madison', 'frances', 'kathryn', 'janice', 'jean', 'abigail', 'alice',
      'judy', 'grace', 'denise', 'amber', 'doris', 'marilyn', 'danielle', 'beverly', 'isabella', 'theresa',
      'diana', 'natalie', 'brittany', 'charlotte', 'marie', 'kayla', 'alexis', 'lori', 'mia', 'ava',
      'chloe', 'ella', 'zoey', 'lily', 'aubrey', 'addison', 'ellie', 'brooklyn', 'scarlett', 'claire',
      'skylar', 'lucy', 'audrey', 'leah', 'ariana', 'allison', 'savannah', 'arianna', 'camila', 'penelope',
      'gabriella', 'aaliyah', 'layla', 'madelyn', 'riley', 'zoe', 'nora', 'eleanor', 'lillian', 'stella',
      'hazel', 'violet', 'aurora', 'bella', 'paisley', 'everly', 'caroline', 'nova', 'genesis', 'emilia',
      'kennedy', 'maya', 'willow', 'kinsley', 'naomi', 'elena', 'cora', 'ruby', 'eva', 'serenity',
      'autumn', 'adeline', 'hailey', 'gianna', 'valentina', 'isla', 'eliana', 'quinn', 'nevaeh', 'ivy',
      'sadie', 'piper', 'lydia', 'alexa', 'josephine', 'emery', 'julia', 'delilah', 'vivian', 'kaylee',
      'sophie', 'brielle', 'madeline', 'peyton', 'rylee', 'clara', 'hadley', 'melanie', 'mackenzie', 'reagan',
      'adalynn', 'liliana', 'aubree', 'jade', 'isabelle', 'natalia', 'raelynn', 'athena', 'ximena', 'arya',
      'leilani', 'taylor', 'faith', 'rose', 'kylie', 'alexandra', 'lyla', 'amaya', 'eliza', 'brianna',
      'bailey', 'khloe', 'jasmine', 'melody', 'iris', 'isabel', 'norah', 'annabelle', 'valeria', 'emerson',
      'adalyn', 'ryleigh', 'eden', 'anastasia', 'alyssa', 'juliana', 'charlie', 'esther', 'ariel', 'cecilia',
      'valerie', 'alina', 'molly', 'reese', 'aliyah', 'lilly', 'parker', 'finley', 'morgan', 'sydney',
      'jordyn', 'eloise', 'trinity', 'daisy', 'keira', 'gracie', 'ana', 'fiona', 'harmony', 'summer',
      'sloane', 'laila', 'juliette', 'sienna', 'londyn', 'ayla', 'callie', 'vivienne', 'maggie', 'camille',
      'amara', 'ariella', 'payton', 'brooke', 'paige', 'genevieve', 'marley', 'presley', 'arabella', 'lucia',
      'tiffany', 'tammy', 'tracy', 'lisa', 'betty', 'helen', 'sandra', 'donna', 'carol', 'ruth',
      'sharon', 'michelle', 'laura', 'sarah', 'kimberly', 'deborah', 'jessica', 'shirley', 'cynthia', 'angela',
      'melissa', 'brenda', 'amy', 'anna', 'rebecca', 'virginia', 'kathleen', 'pamela', 'martha', 'debra',
      'amanda', 'stephanie', 'carolyn', 'christine', 'marie', 'janet', 'catherine', 'frances', 'ann', 'joyce',
      'diane', 'alice', 'julie', 'heather', 'teresa', 'doris', 'gloria', 'evelyn', 'jean', 'cheryl',
      'mildred', 'katherine', 'joan', 'ashley', 'judith', 'rose', 'janice', 'kelly', 'nicole', 'judy',
      'christina', 'kathy', 'theresa', 'beverly', 'denise', 'tammy', 'irene', 'jane', 'lori', 'rachel',
      'marilyn', 'andrea', 'kathryn', 'louise', 'sara', 'anne', 'jacqueline', 'wanda', 'bonnie', 'julia',
      'ruby', 'lois', 'tina', 'phyllis', 'norma', 'paula', 'diana', 'annie', 'lillian', 'emily',
      'robin', 'peggy', 'crystal', 'gladys', 'rita', 'dawn', 'connie', 'florence', 'tracy', 'edna',
      'tiffany', 'carmen', 'rosa', 'cindy', 'grace', 'wendy', 'victoria', 'edith', 'kim', 'sherry',
      'sylvia', 'josephine', 'thelma', 'shannon', 'sheila', 'ethel', 'ellen', 'elaine', 'marjorie', 'carrie',
      'charlotte', 'monica', 'esther', 'pauline', 'emma', 'juanita', 'anita', 'rhonda', 'hazel', 'amber',
      'eva', 'debbie', 'april', 'leslie', 'clara', 'lucille', 'jamie', 'joanne', 'eleanor', 'valerie',
      'danielle', 'megan', 'alicia', 'suzanne', 'michele', 'gail', 'bertha', 'darlene', 'veronica', 'jill',
      'erin', 'geraldine', 'lauren', 'cathy', 'joann', 'lorraine', 'lynn', 'sally', 'regina', 'erica',
      'beatrice', 'dolores', 'bernice', 'audrey', 'yvonne', 'annette', 'june', 'samantha', 'marion', 'dana',
      'stacy', 'ana', 'renee', 'ida', 'vivian', 'roberta', 'holly', 'brittany', 'melanie', 'loretta',
      'yolanda', 'jeanette', 'laurie', 'katie', 'kristen', 'vanessa', 'alma', 'sue', 'elsie', 'beth',
      'jeanne', 'vicki', 'carla', 'tara', 'rosemary', 'eileen', 'terri', 'gertrude', 'lucy', 'tonya',
      'ella', 'stacey', 'wilma', 'gina', 'kristin', 'jessie', 'natasha', 'agnes', 'vera', 'willie',
      'charlene', 'bessie', 'delores', 'melinda', 'pearl', 'arlene', 'maureen', 'colleen', 'allison', 'tamara',
      'joy', 'georgia', 'constance', 'lillie', 'claudia', 'jackie', 'marcia', 'tanya', 'nellie', 'minnie',
      'marlene', 'heidi', 'glenda', 'lydia', 'viola', 'courtney', 'marian', 'stella', 'caroline', 'dora',
      'jo', 'vickie', 'mattie', 'terry', 'maxine', 'irma', 'mabel', 'marsha', 'myrtle', 'lena',
      'christy', 'deanna', 'patsy', 'hilda', 'gwendolyn', 'jennie', 'nora', 'margie', 'nina', 'cassandra',
      'leah', 'penny', 'kay', 'priscilla', 'naomi', 'carole', 'brandy', 'olga', 'billie', 'dianne',
      'tracey', 'leona', 'jenny', 'felicia', 'sonia', 'miriam', 'velma', 'becky', 'bobbie', 'violet'
    ],
    uk: [
      'olivia', 'amelia', 'isla', 'ava', 'mia', 'isabella', 'sophia', 'rosie', 'ella', 'grace',
      'lily', 'emily', 'poppy', 'evie', 'charlotte', 'jessica', 'sophie', 'chloe', 'lucy', 'emma',
      'hannah', 'sarah', 'rebecca', 'rachel', 'laura', 'katie', 'holly', 'amy', 'jade', 'georgia',
      'ellie', 'daisy', 'ruby', 'freya', 'phoebe', 'alice', 'florence', 'sienna', 'matilda', 'ivy',
      'willow', 'harper', 'scarlett', 'bella', 'eva', 'millie', 'esme', 'penelope', 'harriet', 'violet'
    ],
    germany: [
      'emma', 'hannah', 'mia', 'sofia', 'emilia', 'lina', 'lena', 'mila', 'lea', 'marie',
      'anna', 'clara', 'luisa', 'ella', 'charlotte', 'sophie', 'johanna', 'laura', 'julia', 'sarah',
      'lisa', 'nina', 'katharina', 'christina', 'stefanie', 'nicole', 'sandra', 'melanie', 'sabrina', 'jessica',
      'jennifer', 'vanessa', 'michelle', 'nadine', 'daniela', 'claudia', 'petra', 'andrea', 'martina', 'monika',
      'greta', 'frieda', 'ida', 'mathilda', 'amelie', 'nele', 'maja', 'paula', 'marlene', 'helena'
    ],
    france: [
      'jade', 'louise', 'emma', 'alice', 'chloe', 'lina', 'lea', 'manon', 'rose', 'anna',
      'camille', 'sarah', 'clara', 'ines', 'zoe', 'marie', 'julie', 'charlotte', 'sophie', 'laura',
      'pauline', 'marine', 'mathilde', 'margot', 'juliette', 'clemence', 'lucie', 'oceane', 'anais', 'eva',
      'lola', 'nina', 'elise', 'amelie', 'victoire', 'agathe', 'adele', 'valentine', 'helene', 'isabelle',
      'nathalie', 'sandrine', 'valerie', 'sylvie', 'christine', 'catherine', 'monique', 'brigitte', 'francoise', 'martine'
    ],
    canada: [
      'olivia', 'emma', 'charlotte', 'sophia', 'amelia', 'mia', 'isabella', 'ava', 'emily', 'abigail',
      'ella', 'chloe', 'lily', 'grace', 'hannah', 'madison', 'natalie', 'victoria', 'elizabeth', 'sarah',
      'jessica', 'ashley', 'samantha', 'taylor', 'lauren', 'rachel', 'nicole', 'stephanie', 'jennifer', 'amanda',
      'brittany', 'megan', 'kayla', 'rebecca', 'michelle', 'kimberly', 'melissa', 'heather', 'amber', 'danielle',
      'harper', 'evelyn', 'aria', 'scarlett', 'penelope', 'layla', 'riley', 'zoey', 'nora', 'eleanor'
    ],
    australia: [
      'charlotte', 'olivia', 'amelia', 'isla', 'mia', 'ava', 'grace', 'willow', 'harper', 'chloe',
      'ella', 'sophie', 'emily', 'ruby', 'lucy', 'jessica', 'sarah', 'emma', 'hannah', 'lily',
      'madison', 'natalie', 'victoria', 'elizabeth', 'samantha', 'taylor', 'lauren', 'rachel', 'nicole', 'stephanie',
      'georgia', 'zoe', 'matilda', 'ivy', 'sienna', 'evie', 'scarlett', 'bella', 'eva', 'millie',
      'poppy', 'daisy', 'phoebe', 'alice', 'florence', 'freya', 'penelope', 'harriet', 'violet', 'imogen'
    ],
    italy: [
      'sofia', 'aurora', 'giulia', 'alice', 'giorgia', 'emma', 'greta', 'francesca', 'sara', 'vittoria',
      'chiara', 'martina', 'anna', 'beatrice', 'elena', 'maria', 'lucia', 'valentina', 'alessia', 'camilla',
      'elisa', 'federica', 'silvia', 'laura', 'paola', 'roberta', 'simona', 'monica', 'claudia', 'daniela',
      'barbara', 'cristina', 'angela', 'rosa', 'teresa', 'giovanna', 'patrizia', 'rita', 'carla', 'antonella',
      'giada', 'noemi', 'rebecca', 'nicole', 'matilde', 'bianca', 'arianna', 'ludovica', 'carlotta', 'margherita'
    ],
    spain: [
      'lucia', 'sofia', 'martina', 'maria', 'julia', 'paula', 'valeria', 'daniela', 'alba', 'emma',
      'carmen', 'laura', 'claudia', 'sara', 'ana', 'elena', 'irene', 'adriana', 'nuria', 'cristina',
      'patricia', 'marta', 'raquel', 'beatriz', 'silvia', 'monica', 'rosa', 'pilar', 'isabel', 'teresa',
      'angela', 'rocio', 'lorena', 'alicia', 'natalia', 'eva', 'ines', 'laia', 'carla', 'noa',
      'vera', 'abril', 'olivia', 'aitana', 'vega', 'candela', 'lola', 'triana', 'jimena', 'celia'
    ],
    austria: [
      'anna', 'emma', 'lena', 'hannah', 'laura', 'sophia', 'maja', 'marie', 'valentina', 'johanna',
      'lea', 'sarah', 'julia', 'lisa', 'nina', 'katharina', 'christina', 'stefanie', 'nicole', 'sandra',
      'melanie', 'sabrina', 'jessica', 'jennifer', 'vanessa', 'michelle', 'nadine', 'daniela', 'claudia', 'petra',
      'andrea', 'martina', 'monika', 'elisabeth', 'maria', 'eva', 'rosa', 'elsa', 'hanna', 'leonie'
    ],
    switzerland: [
      'emma', 'mia', 'sophia', 'lina', 'elena', 'alina', 'emilia', 'leonie', 'lena', 'nina',
      'laura', 'anna', 'julia', 'sara', 'lea', 'chiara', 'giulia', 'sofia', 'valentina', 'alessia',
      'noemi', 'lisa', 'sarah', 'michelle', 'jessica', 'jennifer', 'vanessa', 'nadine', 'daniela', 'claudia',
      'sandra', 'melanie', 'sabrina', 'nicole', 'stefanie', 'katharina', 'christina', 'andrea', 'martina', 'monika'
    ],
    netherlands: [
      'emma', 'julia', 'sophie', 'tess', 'mila', 'zoe', 'sara', 'eva', 'saar', 'nora',
      'lotte', 'anna', 'isa', 'liv', 'lynn', 'lisa', 'laura', 'anne', 'kim', 'linda',
      'sandra', 'nicole', 'jessica', 'jennifer', 'melissa', 'marieke', 'esther', 'monique', 'ingrid', 'annemarie',
      'fleur', 'roos', 'fenna', 'bente', 'lieke', 'femke', 'danique', 'sanne', 'marloes', 'rianne'
    ],
    sweden: [
      'alice', 'olivia', 'astrid', 'maja', 'vera', 'alma', 'selma', 'elsa', 'stella', 'ebba',
      'wilma', 'ella', 'clara', 'saga', 'freja', 'emma', 'julia', 'linnea', 'ellen', 'agnes',
      'ida', 'elin', 'hanna', 'amanda', 'matilda', 'filippa', 'emilia', 'molly', 'isabelle', 'lilly',
      'anna', 'maria', 'eva', 'karin', 'kristina', 'elisabeth', 'margareta', 'birgitta', 'ingrid', 'gunilla'
    ],
    denmark: [
      'alma', 'clara', 'agnes', 'ida', 'ella', 'sofia', 'freja', 'anna', 'karla', 'nora',
      'emma', 'laura', 'olivia', 'maja', 'isabella', 'victoria', 'emily', 'mathilde', 'sofie', 'frederikke',
      'marie', 'anne', 'karen', 'kirsten', 'hanne', 'susanne', 'lene', 'pia', 'lone', 'bente',
      'inge', 'birthe', 'else', 'grethe', 'jytte', 'bodil', 'tove', 'ruth', 'ellen', 'gerda'
    ],
    norway: [
      'nora', 'emma', 'ella', 'maja', 'sophia', 'olivia', 'sara', 'anna', 'ingrid', 'emilie',
      'sofie', 'thea', 'lea', 'julie', 'ida', 'marie', 'anne', 'kari', 'liv', 'astrid',
      'inger', 'marit', 'bjorg', 'randi', 'solveig', 'gerd', 'berit', 'hilde', 'sissel', 'tone',
      'kristin', 'ellen', 'nina', 'hege', 'mona', 'anita', 'wenche', 'bente', 'turid', 'laila'
    ],
    newzealand: [
      'charlotte', 'isla', 'olivia', 'amelia', 'harper', 'ava', 'willow', 'mia', 'isabella', 'sophia',
      'ella', 'grace', 'lily', 'emily', 'sophie', 'jessica', 'sarah', 'emma', 'hannah', 'madison',
      'natalie', 'victoria', 'elizabeth', 'samantha', 'taylor', 'lauren', 'rachel', 'nicole', 'stephanie', 'georgia',
      'zoe', 'matilda', 'ivy', 'sienna', 'evie', 'scarlett', 'bella', 'eva', 'millie', 'poppy'
    ],
    india: [
      'aadhya', 'ananya', 'pari', 'anika', 'diya', 'aaradhya', 'sara', 'angel', 'kavya', 'kiara',
      'saanvi', 'avni', 'myra', 'prisha', 'navya', 'priya', 'neha', 'pooja', 'anjali', 'shreya',
      'divya', 'riya', 'nisha', 'meera', 'sonia', 'sunita', 'anita', 'rekha', 'geeta', 'seema',
      'mamta', 'shanti', 'lakshmi', 'radha', 'sita', 'uma', 'parvati', 'durga', 'kali', 'saraswati',
      'aishwarya', 'deepika', 'kareena', 'katrina', 'alia', 'sonam', 'vidya', 'madhuri', 'kajol', 'rani'
    ],
    japan: [
      'yui', 'hina', 'sakura', 'aoi', 'yuna', 'himari', 'mei', 'rin', 'koharu', 'akari',
      'mio', 'riko', 'nanami', 'yuzuki', 'haruka', 'yuki', 'ayaka', 'misaki', 'nana', 'saki',
      'miku', 'aya', 'mai', 'emi', 'yuka', 'kana', 'asuka', 'kaori', 'tomoko', 'keiko',
      'yoko', 'michiko', 'sachiko', 'noriko', 'kumiko', 'mariko', 'junko', 'reiko', 'kyoko', 'takako'
    ],
    china: [
      'xin', 'jing', 'li', 'yan', 'ying', 'mei', 'fang', 'min', 'hui', 'ling',
      'na', 'juan', 'qing', 'xia', 'yue', 'hong', 'ping', 'lan', 'hua', 'xue',
      'yu', 'wen', 'qian', 'ting', 'dan', 'lin', 'rong', 'fei', 'yun', 'zhen',
      'wei', 'lei', 'jie', 'ning', 'chen', 'yang', 'lu', 'sha', 'yi', 'ai'
    ],
    brazil: [
      'alice', 'sophia', 'helena', 'valentina', 'laura', 'isabella', 'manuela', 'julia', 'heloisa', 'luiza',
      'maria', 'cecilia', 'eloah', 'lara', 'livia', 'ana', 'beatriz', 'gabriela', 'fernanda', 'camila',
      'amanda', 'bruna', 'carolina', 'daniela', 'eduarda', 'fabiana', 'giovanna', 'isadora', 'jessica', 'karen',
      'larissa', 'mariana', 'natalia', 'olivia', 'patricia', 'rafaela', 'sabrina', 'tatiana', 'vanessa', 'yasmin'
    ],
    mexico: [
      'sofia', 'valentina', 'regina', 'renata', 'camila', 'valeria', 'daniela', 'maria', 'fernanda', 'ximena',
      'andrea', 'paula', 'mariana', 'alejandra', 'gabriela', 'ana', 'guadalupe', 'rosa', 'carmen', 'patricia',
      'elizabeth', 'veronica', 'leticia', 'martha', 'silvia', 'gloria', 'alicia', 'teresa', 'monica', 'laura',
      'claudia', 'adriana', 'sandra', 'lorena', 'rocio', 'marisol', 'yolanda', 'norma', 'beatriz', 'irma'
    ],
  },
};

const lastNames = {
  usa: [
    'smith', 'johnson', 'williams', 'brown', 'jones', 'miller', 'davis', 'garcia', 'rodriguez', 'wilson',
    'martinez', 'anderson', 'taylor', 'thomas', 'hernandez', 'moore', 'martin', 'jackson', 'thompson', 'white',
    'lopez', 'lee', 'gonzalez', 'harris', 'clark', 'lewis', 'robinson', 'walker', 'perez', 'hall',
    'young', 'allen', 'sanchez', 'wright', 'king', 'scott', 'green', 'baker', 'adams', 'nelson',
    'hill', 'ramirez', 'campbell', 'mitchell', 'roberts', 'carter', 'phillips', 'evans', 'turner', 'torres',
    'parker', 'collins', 'edwards', 'stewart', 'flores', 'morris', 'nguyen', 'murphy', 'rivera', 'cook',
    'rogers', 'morgan', 'peterson', 'cooper', 'reed', 'bailey', 'bell', 'gomez', 'kelly', 'howard',
    'ward', 'cox', 'diaz', 'richardson', 'wood', 'watson', 'brooks', 'bennett', 'gray', 'james',
    'reyes', 'cruz', 'hughes', 'price', 'myers', 'long', 'foster', 'sanders', 'ross', 'morales',
    'powell', 'sullivan', 'russell', 'ortiz', 'jenkins', 'gutierrez', 'perry', 'butler', 'barnes', 'fisher',
    'henderson', 'coleman', 'simmons', 'patterson', 'jordan', 'reynolds', 'hamilton', 'graham', 'kim', 'gonzales',
    'alexander', 'ramos', 'wallace', 'griffin', 'west', 'cole', 'hayes', 'chavez', 'gibson', 'bryant',
    'ellis', 'stevens', 'murray', 'ford', 'marshall', 'owens', 'mcdonald', 'harrison', 'ruiz', 'kennedy',
    'wells', 'alvarez', 'woods', 'mendoza', 'castillo', 'olson', 'webb', 'washington', 'tucker', 'freeman',
    'burns', 'henry', 'vasquez', 'snyder', 'simpson', 'crawford', 'jimenez', 'porter', 'mason', 'shaw',
    'gordon', 'wagner', 'hunter', 'romero', 'hicks', 'dixon', 'hunt', 'palmer', 'robertson', 'black',
    'holmes', 'stone', 'meyer', 'boyd', 'mills', 'warren', 'fox', 'rose', 'rice', 'moreno',
    'schmidt', 'patel', 'ferguson', 'nichols', 'herrera', 'medina', 'ryan', 'fernandez', 'weaver', 'daniels',
    'stephens', 'gardner', 'payne', 'kelley', 'dunn', 'pierce', 'arnold', 'tran', 'spencer', 'peters',
    'hawkins', 'grant', 'hansen', 'castro', 'hoffman', 'hart', 'elliott', 'cunningham', 'knight', 'bradley',
    'carroll', 'hudson', 'duncan', 'armstrong', 'berry', 'andrews', 'johnston', 'ray', 'lane', 'riley',
    'carpenter', 'perkins', 'aguilar', 'silva', 'richards', 'willis', 'matthews', 'chapman', 'lawrence', 'garza',
    'vargas', 'watkins', 'wheeler', 'larson', 'carlson', 'harper', 'george', 'greene', 'burke', 'guzman',
    'morrison', 'munoz', 'jacobs', 'obrien', 'lawson', 'franklin', 'lynch', 'bishop', 'carr', 'salazar',
    'austin', 'mendez', 'gilbert', 'jensen', 'williamson', 'montgomery', 'harvey', 'oliver', 'howell', 'dean'
  ],
  uk: [
    'smith', 'jones', 'williams', 'taylor', 'brown', 'davies', 'evans', 'wilson', 'thomas', 'roberts',
    'johnson', 'lewis', 'walker', 'robinson', 'wood', 'thompson', 'white', 'watson', 'jackson', 'wright',
    'green', 'harris', 'cooper', 'king', 'lee', 'martin', 'clarke', 'james', 'morgan', 'hughes',
    'edwards', 'hill', 'moore', 'clark', 'harrison', 'scott', 'young', 'morris', 'hall', 'ward'
  ],
  germany: [
    'mueller', 'schmidt', 'schneider', 'fischer', 'weber', 'meyer', 'wagner', 'becker', 'schulz', 'hoffmann',
    'koch', 'richter', 'klein', 'wolf', 'schroeder', 'neumann', 'schwarz', 'zimmermann', 'braun', 'krueger',
    'hofmann', 'hartmann', 'lange', 'schmitt', 'werner', 'schmitz', 'krause', 'meier', 'lehmann', 'schmid',
    'schulze', 'maier', 'koehler', 'herrmann', 'koenig', 'walter', 'mayer', 'huber', 'kaiser', 'fuchs'
  ],
  france: [
    'martin', 'bernard', 'dubois', 'thomas', 'robert', 'richard', 'petit', 'durand', 'leroy', 'moreau',
    'simon', 'laurent', 'lefebvre', 'michel', 'garcia', 'david', 'bertrand', 'roux', 'vincent', 'fournier',
    'morel', 'girard', 'andre', 'lefevre', 'mercier', 'dupont', 'lambert', 'bonnet', 'francois', 'martinez',
    'legrand', 'garnier', 'faure', 'rousseau', 'blanc', 'guerin', 'muller', 'henry', 'roussel', 'nicolas'
  ],
  canada: [
    'smith', 'brown', 'wilson', 'johnson', 'lee', 'martin', 'roy', 'tremblay', 'gagnon', 'bouchard',
    'cote', 'leblanc', 'gauthier', 'morin', 'pelletier', 'lavoie', 'fortin', 'gagne', 'ouellet', 'bergeron',
    'taylor', 'campbell', 'anderson', 'macdonald', 'mackenzie', 'stewart', 'ross', 'fraser', 'murray', 'reid',
    'williams', 'jones', 'thomas', 'white', 'thompson', 'walker', 'robinson', 'clark', 'wright', 'young'
  ],
  australia: [
    'smith', 'jones', 'williams', 'brown', 'wilson', 'taylor', 'johnson', 'white', 'anderson', 'thompson',
    'nguyen', 'thomas', 'walker', 'harris', 'lee', 'ryan', 'robinson', 'kelly', 'king', 'davis',
    'wright', 'evans', 'roberts', 'green', 'hall', 'wood', 'jackson', 'clarke', 'young', 'morris',
    'martin', 'lewis', 'allen', 'cook', 'hill', 'moore', 'ward', 'watson', 'campbell', 'baker'
  ],
  italy: [
    'rossi', 'ferrari', 'russo', 'bianchi', 'romano', 'colombo', 'ricci', 'marino', 'greco', 'bruno',
    'gallo', 'conti', 'de luca', 'costa', 'giordano', 'mancini', 'rizzo', 'lombardi', 'moretti', 'barbieri',
    'fontana', 'santoro', 'mariani', 'rinaldi', 'caruso', 'ferrara', 'galli', 'martini', 'leone', 'longo',
    'gentile', 'martinelli', 'vitale', 'lombardo', 'serra', 'coppola', 'de santis', 'damico', 'marchetti', 'parisi'
  ],
  spain: [
    'garcia', 'rodriguez', 'gonzalez', 'fernandez', 'lopez', 'martinez', 'sanchez', 'perez', 'gomez', 'martin',
    'jimenez', 'ruiz', 'hernandez', 'diaz', 'moreno', 'alvarez', 'munoz', 'romero', 'alonso', 'gutierrez',
    'navarro', 'torres', 'dominguez', 'vazquez', 'ramos', 'gil', 'ramirez', 'serrano', 'blanco', 'molina',
    'morales', 'suarez', 'ortega', 'delgado', 'castro', 'ortiz', 'rubio', 'marin', 'sanz', 'nunez'
  ],
  austria: [
    'gruber', 'huber', 'bauer', 'wagner', 'mueller', 'pichler', 'steiner', 'moser', 'mayer', 'hofer',
    'leitner', 'berger', 'fuchs', 'eder', 'fischer', 'schmid', 'winkler', 'weber', 'schwarz', 'maier',
    'schneider', 'reiter', 'mayr', 'schmidt', 'wimmer', 'egger', 'brunner', 'lang', 'baumgartner', 'auer'
  ],
  switzerland: [
    'mueller', 'schmid', 'keller', 'weber', 'huber', 'meyer', 'schneider', 'steiner', 'fischer', 'brunner',
    'baumann', 'frei', 'zimmermann', 'moser', 'gerber', 'widmer', 'wyss', 'graf', 'roth', 'sutter',
    'kunz', 'koenig', 'maurer', 'hofer', 'bieri', 'kaufmann', 'bucher', 'berger', 'wenger', 'studer'
  ],
  netherlands: [
    'de jong', 'jansen', 'de vries', 'van den berg', 'bakker', 'janssen', 'visser', 'smit', 'meijer', 'de boer',
    'mulder', 'de groot', 'bos', 'vos', 'peters', 'hendriks', 'van dijk', 'van leeuwen', 'dekker', 'brouwer',
    'de wit', 'dijkstra', 'smits', 'de graaf', 'van der linden', 'kok', 'jacobs', 'de haan', 'vermeer', 'van den broek'
  ],
  sweden: [
    'andersson', 'johansson', 'karlsson', 'nilsson', 'eriksson', 'larsson', 'olsson', 'persson', 'svensson', 'gustafsson',
    'pettersson', 'jonsson', 'jansson', 'hansson', 'bengtsson', 'joensson', 'lindberg', 'jakobsson', 'magnusson', 'lindstroem',
    'olofsson', 'lindgren', 'axelsson', 'berg', 'bergstroem', 'lundberg', 'lindqvist', 'mattsson', 'berglund', 'fredriksson'
  ],
  denmark: [
    'nielsen', 'jensen', 'hansen', 'pedersen', 'andersen', 'christensen', 'larsen', 'sorensen', 'rasmussen', 'jorgensen',
    'petersen', 'madsen', 'kristensen', 'olsen', 'thomsen', 'christiansen', 'poulsen', 'johansen', 'moller', 'mortensen',
    'knudsen', 'jacobsen', 'frederiksen', 'mikkelsen', 'henriksen', 'laursen', 'lund', 'schmidt', 'eriksen', 'holm'
  ],
  norway: [
    'hansen', 'johansen', 'olsen', 'larsen', 'andersen', 'pedersen', 'nilsen', 'kristiansen', 'jensen', 'karlsen',
    'johnsen', 'pettersen', 'eriksen', 'berg', 'haugen', 'hagen', 'johannessen', 'andreassen', 'jacobsen', 'dahl',
    'jorgensen', 'henriksen', 'lund', 'halvorsen', 'sorensen', 'jakobsen', 'moen', 'gundersen', 'iversen', 'strand'
  ],
  newzealand: [
    'smith', 'wilson', 'williams', 'brown', 'thompson', 'jones', 'taylor', 'watson', 'clark', 'walker',
    'robinson', 'white', 'martin', 'anderson', 'harris', 'king', 'scott', 'young', 'mitchell', 'wright',
    'campbell', 'johnson', 'stewart', 'thomas', 'baker', 'hall', 'green', 'wood', 'jackson', 'morris'
  ],
  india: [
    'sharma', 'kumar', 'singh', 'patel', 'gupta', 'khan', 'reddy', 'verma', 'jain', 'agarwal',
    'mehta', 'rao', 'nair', 'iyer', 'das', 'mishra', 'pandey', 'shah', 'joshi', 'chauhan',
    'yadav', 'thakur', 'saxena', 'kapoor', 'malhotra', 'bhatia', 'chopra', 'arora', 'bansal', 'goel',
    'srivastava', 'tiwari', 'dubey', 'shukla', 'bajaj', 'sethi', 'khanna', 'mehra', 'tandon', 'bose'
  ],
  japan: [
    'sato', 'suzuki', 'takahashi', 'tanaka', 'watanabe', 'ito', 'yamamoto', 'nakamura', 'kobayashi', 'kato',
    'yoshida', 'yamada', 'sasaki', 'yamaguchi', 'saito', 'matsumoto', 'inoue', 'kimura', 'hayashi', 'shimizu',
    'yamazaki', 'mori', 'abe', 'ikeda', 'hashimoto', 'yamashita', 'ishikawa', 'nakajima', 'maeda', 'fujita',
    'ogawa', 'goto', 'okada', 'hasegawa', 'murakami', 'kondo', 'ishii', 'sakai', 'sakamoto', 'endo'
  ],
  china: [
    'wang', 'li', 'zhang', 'liu', 'chen', 'yang', 'huang', 'zhao', 'wu', 'zhou',
    'xu', 'sun', 'ma', 'zhu', 'hu', 'guo', 'he', 'gao', 'lin', 'luo',
    'zheng', 'liang', 'xie', 'song', 'tang', 'han', 'feng', 'deng', 'cao', 'peng',
    'zeng', 'xiao', 'tian', 'dong', 'yuan', 'pan', 'yu', 'jiang', 'cai', 'wei'
  ],
  brazil: [
    'silva', 'santos', 'oliveira', 'souza', 'rodrigues', 'ferreira', 'alves', 'pereira', 'lima', 'gomes',
    'costa', 'ribeiro', 'martins', 'carvalho', 'almeida', 'lopes', 'soares', 'fernandes', 'vieira', 'barbosa',
    'rocha', 'dias', 'nascimento', 'andrade', 'moreira', 'nunes', 'marques', 'machado', 'mendes', 'freitas',
    'cardoso', 'ramos', 'goncalves', 'santana', 'teixeira', 'araujo', 'pinto', 'correia', 'moura', 'aguiar'
  ],
  mexico: [
    'hernandez', 'garcia', 'martinez', 'lopez', 'gonzalez', 'rodriguez', 'perez', 'sanchez', 'ramirez', 'torres',
    'flores', 'rivera', 'gomez', 'diaz', 'cruz', 'morales', 'reyes', 'gutierrez', 'ortiz', 'ramos',
    'chavez', 'romero', 'castillo', 'jimenez', 'ruiz', 'mendoza', 'aguilar', 'medina', 'vargas', 'fernandez',
    'herrera', 'castro', 'guzman', 'vazquez', 'rojas', 'de la cruz', 'moreno', 'contreras', 'salazar', 'luna'
  ],
};


// Generate usernames with smart availability prediction and duplicate prevention
export const generateGmailUsernames = (gender, country, style, count, existingEmails = []) => {
  const results = [];
  const countryKey = country || 'usa';
  const generatedEmails = new Set(); // Track generated emails in this session
  const existingEmailsSet = new Set(existingEmails); // Convert to Set for faster lookup
  
  // Get name arrays for the specified country, fallback to USA if not found
  const maleNames = firstNames.male[countryKey] || firstNames.male.usa;
  const femaleNames = firstNames.female[countryKey] || firstNames.female.usa;
  const surnames = lastNames[countryKey] || lastNames.usa;
  
  // Common patterns that are likely to be taken
  const commonPatterns = [
    'admin', 'test', 'user', 'info', 'contact', 'support', 'help', 'mail', 'email',
    'john', 'jane', 'mike', 'sarah', 'david', 'mary', 'james', 'lisa', 'robert', 'jennifer'
  ];
  
  // Birth years that are commonly used (1980-2005)
  const commonYears = [];
  for (let year = 1980; year <= 2005; year++) {
    commonYears.push(year);
  }
  
  let attempts = 0;
  const maxTotalAttempts = count * 10; // Maximum total attempts to prevent infinite loops
  
  while (results.length < count && attempts < maxTotalAttempts) {
    let firstName, lastName;
    
    // 70% chance to use very common names (first 10 names from each list)
    if (Math.random() < 0.7) {
      if (gender === 'male') {
        firstName = maleNames.slice(0, 10)[Math.floor(Math.random() * 10)];
      } else if (gender === 'female') {
        firstName = femaleNames.slice(0, 10)[Math.floor(Math.random() * 10)];
      } else {
        // Both genders - use most common names
        const commonMaleNames = maleNames.slice(0, 10);
        const commonFemaleNames = femaleNames.slice(0, 10);
        const allCommonNames = [...commonMaleNames, ...commonFemaleNames];
        firstName = allCommonNames[Math.floor(Math.random() * allCommonNames.length)];
      }
      lastName = surnames.slice(0, 10)[Math.floor(Math.random() * 10)]; // Use common surnames
    } else {
      // 30% chance to use regular names
      if (gender === 'male') {
        firstName = maleNames[Math.floor(Math.random() * maleNames.length)];
      } else if (gender === 'female') {
        firstName = femaleNames[Math.floor(Math.random() * femaleNames.length)];
      } else {
        const allNames = [...maleNames, ...femaleNames];
        firstName = allNames[Math.floor(Math.random() * allNames.length)];
      }
      lastName = surnames[Math.floor(Math.random() * surnames.length)];
    }
    
    // Generate email based on style - MODIFIED FOR "ALREADY TAKEN" PATTERNS
    let email;
    
    // 40% chance to use very simple patterns that are likely taken
    if (Math.random() < 0.4) {
      const simplePatterns = [
        `${firstName}@gmail.com`,
        `${firstName}${lastName}@gmail.com`,
        `${firstName}.${lastName}@gmail.com`,
        `${firstName}_${lastName}@gmail.com`,
        `${firstName}123@gmail.com`,
        `${firstName}1@gmail.com`,
        `${firstName}2024@gmail.com`,
        `${firstName}${commonYears[Math.floor(Math.random() * commonYears.length)]}@gmail.com`
      ];
      email = simplePatterns[Math.floor(Math.random() * simplePatterns.length)];
    } else {
      // Use style-based generation with simple numbers (likely to be taken)
      const simpleNum = randomInt(1, 99); // Small numbers are more likely taken
      
      switch (style) {
        case 'professional':
          email = `${firstName}.${lastName}@gmail.com`;
          // Add simple number if needed
          if (Math.random() < 0.6) {
            email = `${firstName}.${lastName}${simpleNum}@gmail.com`;
          }
          break;
        case 'creative':
          email = `${firstName}_${lastName}@gmail.com`;
          if (Math.random() < 0.5) {
            email = `${firstName}_${lastName}${simpleNum}@gmail.com`;
          }
          break;
        case 'compact':
          email = `${firstName.substring(0, 3)}${lastName.substring(0, 3)}@gmail.com`;
          if (Math.random() < 0.7) {
            email = `${firstName.substring(0, 3)}${lastName.substring(0, 3)}${simpleNum}@gmail.com`;
          }
          break;
        case 'random':
          const styles = ['standard', 'professional', 'creative', 'compact'];
          const randomStyle = styles[Math.floor(Math.random() * styles.length)];
          const randomResult = generateGmailUsernames(gender, country, randomStyle, 1, existingEmails);
          if (randomResult.length > 0) {
            email = randomResult[0].email;
          } else {
            attempts++;
            continue;
          }
          break;
        default: // standard
          email = `${firstName}${lastName}@gmail.com`;
          if (Math.random() < 0.8) {
            email = `${firstName}${lastName}${simpleNum}@gmail.com`;
          }
      }
    }
    
    email = email.toLowerCase();
    
    // Check if email is unique in our generation
    if (!existingEmailsSet.has(email) && !generatedEmails.has(email)) {
      // Add to generated emails set to prevent duplicates within this batch
      generatedEmails.add(email);
      
      // MODIFIED: Always mark as "likely taken" since we want existing accounts
      let availability = 'taken'; // Always show as taken/existing
      
      // Add some variation for realism
      if (Math.random() < 0.1) {
        availability = 'uncertain'; // 10% uncertain
      }
      
      results.push({
        firstName: firstName.charAt(0).toUpperCase() + firstName.slice(1),
        lastName: lastName.charAt(0).toUpperCase() + lastName.slice(1),
        email: email,
        availability
      });
    }
    
    attempts++;
  }
  
  return results;
};