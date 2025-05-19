const config = require("./config");
const fs = require('fs');
const path = require('path');
const { execSync, spawnSync } = require('child_process');
const crypto = require('crypto');
const chalk = require('chalk');

function debug() {
    if(config.debug) {
        // Convert arguments to an array and apply chalk.gray to string arguments
        const grayArgs = Array.from(arguments).map(arg => 
            typeof arg === 'string' ? chalk.gray(arg) : arg
        );
        console.log(...grayArgs);
    }
}

/**
 * Manages the current working directory input, handling git repositories
 * @param {string} cwd - The input string which could be a local path or git repository URL
 * @returns {string|undefined} - The full path to the template directory or undefined if not found
 */
function manage_cwd(cwd) {
    // 1. Check if 'git' is installed and can be called
    try {
        execSync('git --version', { stdio: 'ignore' });
    } catch (error) {
        console.error('Git is not installed or cannot be called. Please install git and try again.');
        process.exit(1);
    }

    // Convert to lowercase for case-insensitive comparison
    const cwdLower = cwd.toLowerCase();
    
    // 2. Check if the string starts with http://, https://, or git@
    if (cwdLower.startsWith('http://') || cwdLower.startsWith('https://') || cwdLower.startsWith('git@')) {
        // Parse the repository URL
        let repo_path = cwd;
        let template_path = '';
        let ref_path = '';
        
        // Extract ref if it exists
        if (cwd.includes('?ref=')) {
            const parts = cwd.split('?ref=');
            repo_path = parts[0];
            ref_path = parts[1];
        }
        
        // Extract template path for https:// or http:// URLs
        if (cwdLower.startsWith('http')) {
            // Remove protocol and domain to get the path
            const urlParts = repo_path.split('/');
            
            // The first 3 parts are protocol, empty string, and domain
            // e.g., https://github.com/my-org/my-repo/my-path/my-sub-path
            if (urlParts.length > 4) {
                // Extract org/repo for the clone URL
                const cloneUrl = `${urlParts[0]}//${urlParts[2]}/${urlParts[3]}/${urlParts[4]}`;
                
                // Extract template path (everything after org/repo)
                template_path = urlParts.slice(5).join('/');
                
                // Update repo_path to just include the repository URL for cloning
                repo_path = cloneUrl;
            }
        } 
        // Extract template path for git@ URLs
        else if (cwdLower.startsWith('git@')) {
            // Format: git@github.com:my-org/my-repo/my-path/my-subpath
            const colonIndex = repo_path.indexOf(':');
            if (colonIndex !== -1) {
                const pathParts = repo_path.substring(colonIndex + 1).split('/');
                
                // Extract org/repo for the clone URL
                if (pathParts.length > 1) {
                    const domain = repo_path.substring(4, colonIndex); // Extract domain (e.g., github.com)
                    const cloneUrl = `git@${domain}:${pathParts[0]}/${pathParts[1]}`;
                    
                    // Extract template path (everything after org/repo)
                    template_path = pathParts.slice(2).join('/');
                    
                    // Update repo_path to just include the repository URL for cloning
                    repo_path = cloneUrl;
                }
            }
        }
        
        // 3. Clone the repository to a temporary directory
        // Create a random string for the temp directory
        const randomString = crypto.randomBytes(6).toString('hex');
        const tempDir = path.join('/tmp', randomString);
        
        try {
            // Create the temp directory
            fs.mkdirSync(tempDir, { recursive: true });
            
            // Clone the repository
            debug(`Cloning ${repo_path} to ${tempDir}`);
            
            const cloneArgs = ['clone', repo_path, tempDir];
            
            // Add --branch if ref is specified
            if (ref_path) {
                cloneArgs.push('--branch', ref_path);
            }
            
            const cloneResult = spawnSync('git', cloneArgs, { 
                stdio: 'inherit',
                encoding: 'utf-8'
            });
            
            if (cloneResult.status !== 0) {
                console.error(`Failed to clone repository: ${repo_path}`);
                return undefined;
            }
            
            // 4. Check if the template path exists in the cloned repository
            const fullTemplatePath = path.join(tempDir, template_path);
            
            if (template_path && !fs.existsSync(fullTemplatePath)) {
                console.error(`Template path does not exist: ${template_path}`);
                return undefined;
            }
            
            return fullTemplatePath || tempDir;
        } catch (error) {
            console.error(`Error processing git repository: ${error.message}`);
            return undefined;
        }
    }
    
    // If it's not a git repository URL, check if the path exists
    if (!fs.existsSync(cwd)) {
        console.error(`template path does not exist: ${cwd}`);
        return undefined;
    }
    
    // Return the path if it exists
    return cwd;
}


/**
 * Format the input of the user in appropriate format for the application.
 * @param {object} inputData 
 */
function formatInputData(inputData) {
    inputData.accounts = inputData.accounts.split(',').map(value => value.trim());
    for(let i=0; i<inputData.accounts.length; i++) {
        let firstSeparatorIndex = inputData.accounts[i].indexOf(':');
        let secondSeparatorIndex = inputData.accounts[i].indexOf(':', firstSeparatorIndex + 1);
        let env = inputData.accounts[i].substring(0, firstSeparatorIndex).trim();
        let id = inputData.accounts[i].substring(firstSeparatorIndex + 1, secondSeparatorIndex).trim();
        let role = inputData.accounts[i].substring(secondSeparatorIndex + 1).trim();
        inputData.accounts[i] = {env, id, role}
    }
}

module.exports = {
    debug,
    formatInputData,
    manage_cwd
}
