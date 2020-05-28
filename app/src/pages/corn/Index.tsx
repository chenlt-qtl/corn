import React from 'react';
import './Index.less';

export default (): React.ReactNode => (
  <div>
    <header id="header">
			    <div className="container">
			    	<div className="row align-items-center justify-content-between d-flex">
				      <div id="logo" className="header-logo">
				        <a href="/corn">Atomic</a>
				      </div>
				      <nav id="nav-menu-container">
				        <ul className="nav-menu sf-arrows">
				          <li className="menu-active"><a href="#home">Home</a></li>
				          <li><a href="#offer">We Offer</a></li>
				          <li><a href="#about">About</a></li>
				          <li><a href="#project">Project</a></li>
				          <li><a href="#price">Price</a></li>
				          <li className="menu-has-children"><a href="" className="sf-with-ul">Pages</a>
				            <ul>
				              <li><a href="generic.html">Generic</a></li>
				              <li><a href="elements.html">Elements</a></li>
				            </ul>
				          </li>
				        </ul>
				      </nav>		    		
			    	</div>
			    </div>
			  </header>
  </div>

);
